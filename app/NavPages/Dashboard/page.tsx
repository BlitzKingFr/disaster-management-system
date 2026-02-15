"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    TextField,
    Chip,
    CircularProgress,
    Tooltip,
    LinearProgress,
    Card,
    CardContent,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider,
    Avatar,
    Badge
} from "@mui/material";
import { useSession } from "next-auth/react";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RadarIcon from '@mui/icons-material/Radar';
import VerifiedIcon from '@mui/icons-material/Verified';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HomeIcon from '@mui/icons-material/Home';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import { BASE_COORDS, dijkstra, haversineDistance, type Graph } from "@/lib/utils";
import RouteMap from "@/app/Utilities/RouteMap";

interface Incident {
    _id: string;
    disasterType: string;
    description: string;
    status: string;
    reportedBy: string;
    assignedTo?: string;
    severity: number;
    createdAt: string;
    allocatedResources: any[];
    location?: {
        lat: number;
        lng: number;
    };
    address?: string;
    fieldReport?: string;
    urgencyScore?: number;
    verified?: boolean;
    source?: string;
}

interface Agent {
    _id: string;
    name: string;
    role: string;
}

interface Resource {
    _id: string;
    name: string;
    quantity: number;
}

const DRAWER_WIDTH = 280;

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [myAssignments, setMyAssignments] = useState<Incident[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [archive, setArchive] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [activeView, setActiveView] = useState('overview');
    const [userJob, setUserJob] = useState("Command Center");

    // Modal State
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [assignmentData, setAssignmentData] = useState<{
        agentId: string;
        allocations: { resourceId: string; quantity: number }[];
    }>({ agentId: "", allocations: [] });

    const [statusUpdateData, setStatusUpdateData] = useState<{
        fieldReport: string;
    }>({ fieldReport: "controlled" });

    const role = session?.user?.role?.trim()?.toLowerCase() || "";
    const isAdmin = role.includes("admin");
    const isFieldAgent = role.includes("agent") || role.includes("dispatcher");

    useEffect(() => {
        if (status === "authenticated") {
            fetchData();
        }
    }, [status]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const incRes = await fetch("/api/reports");
            if (!incRes.ok) throw new Error("Failed to fetch reports");
            const incData = await incRes.json();

            if (isAdmin) {
                setIncidents(incData.filter((i: Incident) => i.status !== "completed"));
                setArchive(incData.filter((i: Incident) => i.status === "completed"));

                const agentRes = await fetch("/api/users/agents");
                if (agentRes.ok) setAgents(await agentRes.json());

                const resRes = await fetch("/api/resources");
                if (resRes.ok) setResources(await resRes.json());
            }

            if (isFieldAgent && session?.user?.id) {
                const myAll = incData.filter((i: Incident) =>
                    i.assignedTo?.toString() === session.user.id?.toString()
                );
                setMyAssignments(myAll.filter((i: Incident) => i.status !== "completed"));
                setArchive(myAll.filter((i: Incident) => i.status === "completed"));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const runAutomatedScan = async () => {
        setScanning(true);
        try {
            const res = await fetch("/api/cron/detect");
            const data = await res.json();
            if (data.detected > 0) {
                alert(`System Detected ${data.detected} New Incidents from External APIs!`);
                fetchData();
            } else {
                alert("Scan Complete. No new automated alerts found.");
            }
        } catch (e) {
            alert("Scan failed.");
        } finally {
            setScanning(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedIncident) return;
        try {
            const res = await fetch(`/api/incidents/${selectedIncident._id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fieldReport: statusUpdateData.fieldReport })
            });

            if (res.ok) {
                setOpenStatusModal(false);
                fetchData();
            } else {
                const err = await res.text();
                alert("Update failed: " + err);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAssign = async () => {
        if (!selectedIncident) return;
        try {
            const res = await fetch(`/api/incidents/${selectedIncident._id}/assign`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    assignedTo: assignmentData.agentId,
                    allocatedResources: assignmentData.allocations.filter(a => a.quantity > 0)
                })
            });

            if (res.ok) {
                setOpenAssignModal(false);
                fetchData();
                setAssignmentData({ agentId: "", allocations: [] });
            } else {
                const err = await res.text();
                alert("Assignment failed: " + err);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <CircularProgress size={60} />
            </div>
        );
    }

    if (!session) {
        return <div className="p-12 text-center text-red-500 font-bold">Access Denied. Please Login.</div>;
    }

    if (!isAdmin && !isFieldAgent) {
        return (
            <div className="p-12 text-center">
                <h2 className="text-xl font-bold">Standard User Dashboard</h2>
                <p className="text-gray-500 mt-2 italic">Role: "{role || "None"}" | ID: {session?.user?.id || "Unknown"}</p>
                <p className="text-gray-500 mt-2">You don't have mission-critical permissions. Please report incidents via the home page.</p>
            </div>
        );
    }

    // Calculate statistics
    const totalIncidents = incidents.length;
    const criticalIncidents = incidents.filter(i => i.severity >= 4).length;
    const verifiedIncidents = incidents.filter(i => i.verified).length;
    const activeAgents = agents.length;
    const totalResources = resources.reduce((sum, r) => sum + r.quantity, 0);
    const lowStockResources = resources.filter(r => r.quantity < 10).length;

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
        { id: 'incidents', label: 'Incidents', icon: <ReportProblemIcon />, badge: totalIncidents },
        { id: 'agents', label: 'Field Agents', icon: <PeopleIcon />, badge: activeAgents },
        { id: 'resources', label: 'Resources', icon: <InventoryIcon />, badge: lowStockResources > 0 ? lowStockResources : undefined },
        { id: 'analytics', label: 'Analytics', icon: <BarChartIcon /> },
        { id: 'home', label: 'Exit Dashboard', icon: <HomeIcon /> },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Sidebar */}
            {isAdmin && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: DRAWER_WIDTH,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                            color: 'white',
                        },
                    }}
                >
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <DashboardIcon className="text-white" fontSize="large" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black">Admin Panel</h2>
                                <p className="text-xs text-gray-400">Control Center</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                                {session.user?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                                <p className="text-xs text-gray-400">Administrator</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block tracking-wider">Current Duty Role</label>
                            <select
                                className="w-full bg-black/20 text-xs text-gray-300 rounded-lg border border-gray-700 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer transition-colors hover:bg-black/30 appearance-none"
                                value={userJob}
                                onChange={(e) => setUserJob(e.target.value)}
                                style={{ backgroundImage: 'none' }} // Remove default arrow if needed, or keep it
                            >
                                <option value="Command Center" className="bg-slate-800">Command Center</option>
                                <option value="Dispatch" className="bg-slate-800">Dispatch Officer</option>
                                <option value="Logistics" className="bg-slate-800">Logistics Manager</option>
                                <option value="Field Ops" className="bg-slate-800">Field Ops Lead</option>
                                <option value="Analyst" className="bg-slate-800">Intel Analyst</option>
                            </select>
                        </div>
                    </div>

                    {/* Navigation */}
                    <List className="flex-1 p-3">
                        {sidebarItems.map((item) => (
                            <ListItemButton
                                key={item.id}
                                selected={activeView === item.id}
                                onClick={() => {
                                    if (item.id === 'home') {
                                        window.location.href = '/';
                                    } else {
                                        setActiveView(item.id);
                                    }
                                }}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    '&.Mui-selected': {
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                        }
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                    {item.badge !== undefined ? (
                                        <Badge badgeContent={item.badge} color="error">
                                            {item.icon}
                                        </Badge>
                                    ) : item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        ))}
                    </List>

                    {/* Quick Actions */}
                    <div className="p-3 border-t border-gray-700">
                        <div className="mb-2 px-1">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">System Tools</p>
                        </div>
                        <Tooltip title="Run automated detection algorithms on external APIs (USGS, OpenWeather) to find and verify unreported disasters." arrow placement="right">
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={scanning ? <CircularProgress size={20} color="inherit" /> : <RadarIcon />}
                                onClick={runAutomatedScan}
                                disabled={scanning}
                                sx={{
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                    },
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 700
                                }}
                            >
                                {scanning ? "Scanning..." : "Scan External APIs"}
                            </Button>
                        </Tooltip>
                        <p className="text-[10px] text-gray-500 mt-2 text-center">
                            Syncs with USGS & OpenWeather
                        </p>
                    </div>
                </Drawer>
            )}

            {/* Main Content */}
            <div className="flex-1" style={{ marginLeft: isAdmin ? 0 : 0 }}>
                <div className="p-6">
                    {isAdmin ? (
                        <>
                            {activeView === 'overview' && (
                                <AdminOverview
                                    incidents={incidents}
                                    agents={agents}
                                    resources={resources}
                                    stats={{
                                        totalIncidents,
                                        criticalIncidents,
                                        verifiedIncidents,
                                        activeAgents,
                                        totalResources,
                                        lowStockResources
                                    }}
                                />
                            )}
                            {activeView === 'incidents' && (
                                <AdminIncidents
                                    incidents={incidents}
                                    onAssign={(inc) => {
                                        setSelectedIncident(inc);
                                        setOpenAssignModal(true);
                                    }}
                                />
                            )}
                            {activeView === 'agents' && (
                                <AgentsView agents={agents} incidents={incidents} />
                            )}
                            {activeView === 'resources' && (
                                <ResourcesView resources={resources} />
                            )}
                            {activeView === 'analytics' && (
                                <AnalyticsView incidents={incidents} archive={archive} />
                            )}
                        </>
                    ) : (
                        <AgentDashboard
                            myAssignments={myAssignments}
                            onUpdateStatus={(inc) => {
                                setSelectedIncident(inc);
                                setOpenStatusModal(true);
                            }}
                        />
                    )}
                </div>

                {/* Modals */}
                <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Assign Incident Response</DialogTitle>
                    <DialogContent>
                        <div className="space-y-6 pt-2">
                            <TextField
                                select
                                label="Select Field Agent"
                                fullWidth
                                value={assignmentData.agentId}
                                onChange={(e) => setAssignmentData({ ...assignmentData, agentId: e.target.value })}
                            >
                                {agents.map((agent) => (
                                    <MenuItem key={agent._id} value={agent._id}>
                                        {agent.name} ({agent.role})
                                    </MenuItem>
                                ))}
                            </TextField>

                            <div>
                                <h4 className="text-sm font-semibold mb-2 text-gray-700">Allocate Resources</h4>
                                <div className="space-y-3 max-h-60 overflow-y-auto border p-3 rounded-lg">
                                    {resources.map((resource) => (
                                        <div key={resource._id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                            <div>
                                                <p className="font-medium text-sm">{resource.name}</p>
                                                <p className="text-xs text-gray-500">Avail: {resource.quantity}</p>
                                            </div>
                                            <TextField
                                                type="number"
                                                size="small"
                                                label="Qty"
                                                className="w-20"
                                                InputProps={{ inputProps: { min: 0, max: resource.quantity } }}
                                                onChange={(e) => {
                                                    const qty = parseInt(e.target.value) || 0;
                                                    const existing = assignmentData.allocations.filter(a => a.resourceId !== resource._id);
                                                    if (qty > 0) {
                                                        setAssignmentData({
                                                            ...assignmentData,
                                                            allocations: [...existing, { resourceId: resource._id, quantity: qty }]
                                                        });
                                                    } else {
                                                        setAssignmentData({ ...assignmentData, allocations: existing });
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAssignModal(false)}>Cancel</Button>
                        <Button onClick={handleAssign} variant="contained" color="primary">Assign & Allocate</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openStatusModal} onClose={() => setOpenStatusModal(false)} maxWidth="xs" fullWidth>
                    <DialogTitle>Update Mission Status</DialogTitle>
                    <DialogContent>
                        <div className="pt-4">
                            <TextField
                                select
                                label="Mission Outcome"
                                fullWidth
                                value={statusUpdateData.fieldReport}
                                onChange={(e) => setStatusUpdateData({ ...statusUpdateData, fieldReport: e.target.value })}
                            >
                                <MenuItem value="controlled">🟢 Controlled / Safe</MenuItem>
                                <MenuItem value="out_of_control">🔴 Out of Control / Needs Support</MenuItem>
                            </TextField>
                            <p className="text-xs text-gray-500 mt-4 italic">
                                Note: Updating the status will complete the mission and archive it.
                            </p>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenStatusModal(false)}>Cancel</Button>
                        <Button onClick={handleStatusUpdate} variant="contained" color="success">Finish Mission</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

// Overview Component
function AdminOverview({ incidents, agents, resources, stats }: any) {
    const statCards = [
        {
            title: "Total Incidents",
            value: stats.totalIncidents,
            change: "+12%",
            trend: "up",
            color: "from-blue-500 to-blue-600",
            icon: <ReportProblemIcon fontSize="large" />
        },
        {
            title: "Critical Alerts",
            value: stats.criticalIncidents,
            change: "+8%",
            trend: "up",
            color: "from-red-500 to-red-600",
            icon: <LocalFireDepartmentIcon fontSize="large" />
        },
        {
            title: "Active Agents",
            value: stats.activeAgents,
            change: "+3",
            trend: "up",
            color: "from-green-500 to-green-600",
            icon: <PeopleIcon fontSize="large" />
        },
        {
            title: "Total Resources",
            value: stats.totalResources,
            change: "-5%",
            trend: "down",
            color: "from-purple-500 to-purple-600",
            icon: <InventoryIcon fontSize="large" />
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-600 dark:text-gray-400">Real-time system monitoring and statistics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <Card key={index} className="hover:shadow-xl transition-shadow">
                        <CardContent>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {stat.trend === 'up' ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                                    <span className="text-xs font-bold">{stat.change}</span>
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Incidents */}
            <Card className="mb-6">
                <CardContent>
                    <h2 className="text-2xl font-bold mb-4">Recent Incidents</h2>
                    <div className="space-y-3">
                        {incidents.slice(0, 5).map((inc: Incident) => (
                            <div key={inc._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${inc.severity >= 4 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {inc.disasterType === 'Fire' ? <LocalFireDepartmentIcon /> : <WaterDamageIcon />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{inc.disasterType}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{inc.address || inc.description.slice(0, 50)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Chip
                                        label={`Severity ${inc.severity}`}
                                        size="small"
                                        color={inc.severity >= 4 ? "error" : "warning"}
                                    />
                                    <Chip
                                        label={inc.status}
                                        size="small"
                                        color={inc.status === 'verified' ? 'success' : 'default'}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Incidents View Component - Redesigned
function AdminIncidents({ incidents, onAssign }: { incidents: Incident[], onAssign: (inc: Incident) => void }) {
    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Incident Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time emergency feed • Sorted by Urgency Score (Merge Sort)</p>
                </div>
                <div className="flex gap-2">
                    <Chip
                        label={`Total: ${incidents.length}`}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />
                    <Chip
                        label={`Pending: ${incidents.filter(i => i.status === 'pending').length}`}
                        color="warning"
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />
                    <Chip
                        label={`Verified: ${incidents.filter(i => i.verified).length}`}
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-[#252525] text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-4 py-3 w-12">#</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Location / Desc</th>
                                <th className="px-4 py-3 text-center">Sev</th>
                                <th className="px-4 py-3 w-24">Score</th>
                                <th className="px-4 py-3">Source</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {incidents.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <ReportProblemIcon fontSize="large" className="text-slate-300" />
                                            <p>No incidents reported yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : incidents.map((incident, idx) => (
                                <tr key={incident._id} className={`group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${incident.status === 'pending' ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}>
                                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 capitalize">
                                            {incident.disasterType}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-xs">
                                        <div className="truncate font-medium text-slate-900 dark:text-white" title={incident.address || "No address"}>
                                            {incident.address || "Unknown Location"}
                                        </div>
                                        <div className="truncate text-xs text-slate-500" title={incident.description}>
                                            {incident.description}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${incident.severity >= 4 ? 'bg-red-100 text-red-700' :
                                            incident.severity === 3 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {incident.severity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${incident.urgencyScore && incident.urgencyScore > 50 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${Math.min(100, incident.urgencyScore || 0)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                                                {Math.round(incident.urgencyScore || 0)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${incident.source === 'anonymous' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                                                incident.source === 'api' ? 'bg-purple-100 text-purple-600 border border-purple-200' :
                                                    'bg-blue-50 text-blue-600 border border-blue-100'
                                                }`}>
                                                {incident.source || 'User'}
                                            </span>
                                            {incident.source === 'anonymous' && (
                                                <span className="text-[10px] text-slate-400 mt-0.5 ml-1">Needs Verify</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Chip
                                            label={incident.status}
                                            size="small"
                                            color={
                                                incident.status === 'verified' ? 'success' :
                                                    incident.status === 'pending' ? 'warning' :
                                                        incident.status === 'assigned' ? 'info' : 'default'
                                            }
                                            variant={incident.status === 'pending' ? 'filled' : 'outlined'}
                                            className="font-bold text-xs uppercase"
                                            sx={{ height: 24 }}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {incident.status !== 'assigned' && incident.status !== 'completed' && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => onAssign(incident)}
                                                startIcon={<AssignmentIndIcon />}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontSize: '0.75rem',
                                                    backgroundColor: incident.status === 'pending' ? '#f59e0b' : undefined,
                                                    '&:hover': {
                                                        backgroundColor: incident.status === 'pending' ? '#d97706' : undefined
                                                    }
                                                }}
                                            >
                                                {incident.status === 'pending' ? 'Review' : 'Assign'}
                                            </Button>
                                        )}
                                        {incident.status === 'assigned' && (
                                            <span className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-1">
                                                <VerifiedIcon fontSize="inherit" /> Assigned
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Agents View
function AgentsView({ agents, incidents }: { agents: Agent[], incidents: Incident[] }) {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Field Agents</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage and monitor field personnel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => {
                    const assignedIncidents = incidents.filter(i => i.assignedTo === agent._id);
                    return (
                        <Card key={agent._id} className="hover:shadow-xl transition-shadow">
                            <CardContent>
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar sx={{ width: 56, height: 56, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                        {agent.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-lg">{agent.name}</h3>
                                        <Chip label={agent.role} size="small" color="primary" />
                                    </div>
                                </div>
                                <Divider className="my-3" />
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Active Missions:</span>
                                        <span className="font-bold">{assignedIncidents.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Status:</span>
                                        <Chip label="Active" size="small" color="success" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

// Resources View
function ResourcesView({ resources }: { resources: Resource[] }) {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Resource Inventory</h1>
                <p className="text-gray-600 dark:text-gray-400">Track and manage emergency resources</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <Card key={resource._id} className="hover:shadow-xl transition-shadow">
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-xl">{resource.name}</h3>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${resource.quantity < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    <InventoryIcon />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Available Quantity</p>
                                    <p className="text-3xl font-black">{resource.quantity}</p>
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(100, (resource.quantity / 50) * 100)}
                                    color={resource.quantity < 10 ? "error" : "success"}
                                    className="h-2 rounded"
                                />
                                {resource.quantity < 10 && (
                                    <Chip label="Low Stock" size="small" color="error" />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Analytics View
function AnalyticsView({ incidents, archive }: { incidents: Incident[], archive: Incident[] }) {
    const totalProcessed = incidents.length + archive.length;
    const completionRate = totalProcessed > 0 ? ((archive.length / totalProcessed) * 100).toFixed(1) : 0;

    const disasterTypes = incidents.reduce((acc: any, inc) => {
        acc[inc.disasterType] = (acc[inc.disasterType] || 0) + 1;
        return acc;
    }, {});

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Analytics & Reports</h1>
                <p className="text-gray-600 dark:text-gray-400">System performance and insights</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardContent>
                        <h3 className="text-xl font-bold mb-4">Completion Rate</h3>
                        <div className="text-center">
                            <p className="text-6xl font-black text-green-600 mb-2">{completionRate}%</p>
                            <p className="text-gray-600">{archive.length} of {totalProcessed} incidents resolved</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <h3 className="text-xl font-bold mb-4">Incident Distribution</h3>
                        <div className="space-y-3">
                            {Object.entries(disasterTypes).map(([type, count]: [string, any]) => (
                                <div key={type}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{type}</span>
                                        <span className="text-sm font-bold">{count}</span>
                                    </div>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(count / incidents.length) * 100}
                                        className="h-2 rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Agent Dashboard (unchanged from before, but simplified)
function AgentDashboard({ myAssignments, onUpdateStatus }: { myAssignments: Incident[], onUpdateStatus: (inc: Incident) => void }) {
    const [roadRoutes, setRoadRoutes] = useState<Record<string, [number, number][] | null>>({});

    useEffect(() => {
        const fetchRoutes = async () => {
            const cachedRoutesStr = localStorage.getItem("dms_road_routes");
            const cachedRoutes: Record<string, [number, number][]> = cachedRoutesStr ? JSON.parse(cachedRoutesStr) : {};

            const newRoutes: Record<string, [number, number][] | null> = { ...roadRoutes };
            let hasNew = false;

            const entries = await Promise.all(
                myAssignments.map(async (incident) => {
                    if (!incident.location) return [incident._id, null] as const;

                    if (roadRoutes[incident._id]) return [incident._id, roadRoutes[incident._id]] as const;
                    if (cachedRoutes[incident._id]) {
                        return [incident._id, cachedRoutes[incident._id]] as const;
                    }

                    try {
                        const res = await fetch("/api/routes/road", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                from: { lat: BASE_COORDS.lat, lng: BASE_COORDS.lng },
                                to: {
                                    lat: incident.location.lat,
                                    lng: incident.location.lng,
                                },
                            }),
                        });

                        if (!res.ok) {
                            console.warn("Road route failed for incident", incident._id);
                            return [incident._id, null] as const;
                        }
                        const data = await res.json();
                        const path = (data.path as [number, number][]) || null;
                        if (path) {
                            cachedRoutes[incident._id] = path;
                            hasNew = true;
                        }
                        return [incident._id, path] as const;
                    } catch (e) {
                        console.warn("Road route error for incident", incident._id, e);
                        return [incident._id, null] as const;
                    }
                })
            );

            const map: Record<string, [number, number][] | null> = {};
            for (const [id, path] of entries) {
                map[id] = path;
            }
            setRoadRoutes(map);

            if (hasNew) {
                localStorage.setItem("dms_road_routes", JSON.stringify(cachedRoutes));
            }
        };

        if (myAssignments.length > 0) {
            fetchRoutes();
        } else {
            setRoadRoutes({});
        }
    }, [myAssignments]);

    const buildSimpleRouteGraph = (incident: Incident): { distanceKm: number; path: string[] } | null => {
        if (!incident.location) return null;

        const incidentNodeId = `INCIDENT_${incident._id}`;

        const graph: Graph = {
            BASE: [
                {
                    to: incidentNodeId,
                    weight: haversineDistance(
                        BASE_COORDS.lat,
                        BASE_COORDS.lng,
                        incident.location.lat,
                        incident.location.lng
                    ),
                },
            ],
        };

        graph[incidentNodeId] = [
            {
                to: "BASE",
                weight: graph.BASE[0].weight,
            },
        ];

        const result = dijkstra(graph, "BASE", incidentNodeId);
        if (!result) return null;
        return { distanceKm: result.distance, path: result.path };
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Active Missions (Route Optimization: Dijkstra)</h2>
            {myAssignments.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No missions assigned to you yet.</p>
                    <p className="text-sm text-gray-400">Wait for high command to dispatch an incident.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {myAssignments.map((incident) => (
                        <div
                            key={incident._id}
                            className="border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5 rounded-lg flex flex-col md:flex-row justify-between items-start gap-4"
                        >
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-red-600">{incident.disasterType}</h3>
                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">Priority: {incident.severity}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">{incident.description}</p>
                                <div className="text-xs text-gray-500 space-y-1">
                                    {incident.address && (
                                        <p><span className="font-semibold">Location:</span> {incident.address}</p>
                                    )}
                                    {incident.location && (
                                        <p>
                                            <span className="font-semibold">Coordinates:</span>{" "}
                                            {incident.location.lat.toFixed(5)}, {incident.location.lng.toFixed(5)}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {incident.allocatedResources?.length > 0 ? (
                                        incident.allocatedResources.map((res: any, idx: number) => (
                                            <Chip
                                                key={idx}
                                                label={`${res.resourceId?.name || 'Resource'}: ${res.quantity}`}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            />
                                        ))
                                    ) : (
                                        <span className="text-xs text-gray-400">No resources allocated</span>
                                    )}
                                </div>

                                {(() => {
                                    const route = buildSimpleRouteGraph(incident);
                                    if (!route) return null;

                                    return (
                                        <div className="mt-2 text-xs text-gray-500 border-t border-dashed border-gray-300 pt-2">
                                            <p className="font-semibold mb-1">Route from Base (Dijkstra):</p>
                                            <p>
                                                <span className="font-medium">Base</span> ({BASE_COORDS.lat.toFixed(5)},{" "}
                                                {BASE_COORDS.lng.toFixed(5)}) →{" "}
                                                <span className="font-medium">Incident Site</span>{" "}
                                                {incident.location
                                                    ? `(${incident.location.lat.toFixed(5)}, ${incident.location.lng.toFixed(5)})`
                                                    : ""}
                                            </p>
                                            <p className="mt-1">
                                                <span className="font-medium">Shortest distance:</span>{" "}
                                                {route.distanceKm.toFixed(2)} km
                                            </p>
                                            {incident.location && (
                                                <div className="mt-3">
                                                    <RouteMap
                                                        from={{
                                                            lat: BASE_COORDS.lat,
                                                            lng: BASE_COORDS.lng,
                                                            label: "Base",
                                                        }}
                                                        to={{
                                                            lat: incident.location.lat,
                                                            lng: incident.location.lng,
                                                            label: "Incident",
                                                        }}
                                                        roadPath={roadRoutes[incident._id] || undefined}
                                                        zoom={13}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="text-xs text-gray-400">Assigned: {new Date(incident.createdAt).toLocaleDateString()}</span>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => onUpdateStatus(incident)}
                                >
                                    Update Status
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div>
    );
}
