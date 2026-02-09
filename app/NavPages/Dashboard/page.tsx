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
} from "@mui/material";
import { useSession } from "next-auth/react";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
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
            // Fetch Incidents
            const incRes = await fetch("/api/reports"); // Reuse existing reports API if it returns all
            if (!incRes.ok) throw new Error("Failed to fetch reports");
            const incData = await incRes.json();

            if (isAdmin) {
                // Admin sees unassigned or pending - fetch everything to manage
                setIncidents(incData);

                // Fetch Agents
                const agentRes = await fetch("/api/users/agents");
                if (agentRes.ok) setAgents(await agentRes.json());

                // Fetch Resources
                const resRes = await fetch("/api/resources");
                if (resRes.ok) setResources(await resRes.json());
            }

            if (isFieldAgent && session?.user?.id) {
                // Filter incidents assigned to the current user
                // Using .toString() safely to handle potential ID object/string mix
                const assigned = incData.filter((i: Incident) =>
                    i.assignedTo?.toString() === session.user.id?.toString()
                );
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
        return <div className="p-12 text-center text-red-500 font-bold">Access Denied. Please Login.</div>;
    }

    // Role-based logic to handle lack of access
    if (!isAdmin && !isFieldAgent) {
        return (
            <div className="p-12 text-center">
                <h2 className="text-xl font-bold">Standard User Dashboard</h2>
                <p className="text-gray-500 mt-2 italic">Role: "{role || "None"}" | ID: {session?.user?.id || "Unknown"}</p>
                <p className="text-gray-500 mt-2">You don't have mission-critical permissions. Please report incidents via the home page.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white uppercase tracking-tight">
                    {isAdmin ? "🏛️ Admin Command Center" : "📍 Field Operations"}
                </h1>

                {isAdmin ? (
                    <AdminDashboard
                        incidents={incidents}
                        onAssign={(inc) => {
                            setSelectedIncident(inc);
                            setOpenAssignModal(true);
                        }}
                    />
                ) : (
                    <AgentDashboard myAssignments={myAssignments} />
                )}

                {/* Assignment Modal (Shared or Admin Only) */}
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
            </div>
        </div>
    );
}

function AdminDashboard({ incidents, onAssign }: { incidents: Incident[], onAssign: (inc: Incident) => void }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Incident Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="px-6 py-3">Disaster</th>
                            <th className="px-6 py-3">Severity</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Assignment</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {incidents.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No incidents reported yet.</td></tr>
                        ) : incidents.map((incident) => (
                            <tr key={incident._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{incident.disasterType}</td>
                                <td className="px-6 py-4 font-bold text-red-600">{incident.severity}/5</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${incident.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        incident.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {incident.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {incident.assignedTo ? "✅ Assigned" : "❌ Unassigned"}
                                </td>
                                <td className="px-6 py-4">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AssignmentIndIcon />}
                                        onClick={() => onAssign(incident)}
                                        disabled={!!incident.assignedTo}
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
    );
}

function AgentDashboard({ myAssignments }: { myAssignments: Incident[] }) {
    const [roadRoutes, setRoadRoutes] = useState<Record<string, [number, number][] | null>>({});

    // Fetch road-following routes for each assignment using the backend proxy.
    useEffect(() => {
        const fetchRoutes = async () => {
            const entries = await Promise.all(
                myAssignments.map(async (incident) => {
                    if (!incident.location) return [incident._id, null] as const;
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
                        return [incident._id, (data.path as [number, number][]) || null] as const;
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

        // Make graph undirected by mirroring the edge back to BASE
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Active Missions</h2>
            {/* Added debug info for agent to verify alignment */}
            <p className="text-[10px] text-gray-400 mb-4 font-mono">Operations ID: {myAssignments[0]?.assignedTo || "No current missions"}</p>
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

                                {/* Route info using Dijkstra from HQ/base to incident */}
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
                                <Button variant="contained" color="success" size="small">Update Status</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div>
    );
}
