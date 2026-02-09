"use client";
import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Checkbox, ListItemText, TextField, Chip, CircularProgress, IconButton } from "@mui/material";
import { useSession } from "next-auth/react";
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
}

interface Agent {
    _id: string;
    name: string;
}

interface Resource {
    _id: string;
    name: string;
    quantity: number;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [myAssignments, setMyAssignments] = useState<Incident[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [assignmentData, setAssignmentData] = useState<{
        agentId: string;
        allocations: { resourceId: string; quantity: number }[];
    }>({ agentId: "", allocations: [] });

    const isFieldAgent = session?.user?.role?.toLowerCase()?.includes("dispatcher") || session?.user?.role?.toLowerCase()?.includes("agent");
    const isAdmin = session?.user?.role?.toLowerCase()?.includes("admin");

    useEffect(() => {
        if (status === "authenticated") {
            fetchData();
        }
    }, [status]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Incidents
            const incRes = await fetch("/api/reports"); // Reuse existing reports API if it returns all
            const incData = await incRes.json();

            if (isAdmin) {
                // Admin sees unassigned or pending
                setIncidents(incData.filter((i: Incident) => i.status !== "resolved"));

                // Fetch Agents
                const agentRes = await fetch("/api/users/agents");
                setAgents(await agentRes.json());

                // Fetch Resources
                const resRes = await fetch("/api/resources");
                setResources(await resRes.json());
            } else if (isFieldAgent && session?.user?.id) {
                // Filter incidents assigned to the current user
                const assigned = incData.filter((i: Incident) => i.assignedTo === session.user.id);
                setMyAssignments(assigned);
            }
            // Separate assignments logic (or use API specifically for "my-assignments")
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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
                fetchData(); // Refresh
                setAssignmentData({ agentId: "", allocations: [] });
            } else {
                const err = await res.text();
                alert("Assignment failed: " + err);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (status === "loading" || loading) {
        return <div className="p-12 text-center"><CircularProgress /></div>;
    }

    if (!session) {
        return <div className="p-12 text-center">Access Denied. Please Login.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                    {isAdmin ? "Command Center Dashboard" : "Field Operations Dashboard"}
                </h1>

                {/* ADMIN VIEW */}
                {isAdmin && (
                    <div className="grid gap-6">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Pending Assignments</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                    <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
                                        <tr>
                                            <th className="px-6 py-3">Disaster</th>
                                            <th className="px-6 py-3">Severity</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Assigned To</th>
                                            <th className="px-6 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {incidents.map((incident) => (
                                            <tr key={incident._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{incident.disasterType}</td>
                                                <td className="px-6 py-4">{incident.severity}/5</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${incident.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        incident.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {incident.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {incident.assignedTo ? "✅ Assigned" : "Unassigned"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<AssignmentIndIcon />}
                                                        onClick={() => {
                                                            setSelectedIncident(incident);
                                                            setOpenAssignModal(true);
                                                        }}
                                                        disabled={!!incident.assignedTo} // Disable if already assigned
                                                    >
                                                        Assign
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* FIELD AGENT VIEW */}
                {!isAdmin && (
                    <div className="grid gap-6">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">My Active Assignments</h2>
                            {myAssignments.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No active assignments found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                        <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
                                            <tr>
                                                <th className="px-6 py-3">Disaster</th>
                                                <th className="px-6 py-3">Description</th>
                                                <th className="px-6 py-3">Severity</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Resources</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                            {myAssignments.map((incident) => (
                                                <tr key={incident._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{incident.disasterType}</td>
                                                    <td className="px-6 py-4 truncate max-w-xs" title={incident.description}>{incident.description}</td>
                                                    <td className="px-6 py-4">{incident.severity}/5</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                                incident.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {incident.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {incident.allocatedResources?.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {incident.allocatedResources.map((res: any, idx: number) => (
                                                                    <Chip
                                                                        key={idx}
                                                                        label={`${res.resourceId?.name || 'Item'}: ${res.quantity}`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        className="text-xs"
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* MODAL for Assignment */}
                <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Assign Incident Response</DialogTitle>
                    <DialogContent>
                        <div className="space-y-6 pt-2">
                            {/* Agent Selection */}
                            <TextField
                                select
                                label="Select Field Agent"
                                fullWidth
                                value={assignmentData.agentId}
                                onChange={(e) => setAssignmentData({ ...assignmentData, agentId: e.target.value })}
                            >
                                {agents.map((agent) => (
                                    <MenuItem key={agent._id} value={agent._id}>
                                        {agent.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* Resource Allocation */}
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
            </div>
        </div>
    );
}
