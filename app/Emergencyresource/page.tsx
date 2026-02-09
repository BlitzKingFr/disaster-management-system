"use client";
import React, { useEffect, useState } from "react";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, Chip, CircularProgress } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupsIcon from '@mui/icons-material/Groups';
import BackpackIcon from '@mui/icons-material/Backpack';

interface Resource {
    _id: string;
    name: string;
    type: "Vehicle" | "Equipment" | "Personnel" | "Supply";
    quantity: number;
    unit: string;
    status: "Available" | "Depleted";
}

const RESOURCE_ICONS = {
    Vehicle: <DirectionsCarIcon />,
    Equipment: <BackpackIcon />,
    Personnel: <GroupsIcon />,
    Supply: <LocalHospitalIcon />,
};

export default function EmergencyResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false); // Can be fetched from session

    // Form State
    const [newResource, setNewResource] = useState({
        name: "",
        type: "Supply",
        quantity: 0,
        unit: "units"
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchResources();
        // Check if user is admin (simplified check - in real app use session)
        fetch("/api/auth/session").then(res => res.json()).then(session => {
            if (session?.user?.role === "Admin") setIsAdmin(true);
        });
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/resources");
            if (res.ok) {
                const data = await res.json();
                setResources(data);
            }
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddResource = async () => {
        try {
            const res = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newResource)
            });
            if (res.ok) {
                fetchResources();
                setShowForm(false);
                setNewResource({ name: "", type: "Supply", quantity: 0, unit: "units" });
            } else {
                alert("Failed to add resource. Ensure you are an Admin.");
            }
        } catch (error) {
            console.error("Error adding resource", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Emergency Resources</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage and track critical assets in real-time.</p>
                    </div>
                    {isAdmin && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setShowForm(!showForm)}
                            sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
                        >
                            Add Resource
                        </Button>
                    )}
                </div>

                {/* Add Resource Form (Admin Only) */}
                {showForm && (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Resource</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <TextField
                                label="Name"
                                variant="outlined"
                                size="small"
                                value={newResource.name}
                                onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                            />
                            <FormControl size="small">
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={newResource.type}
                                    label="Type"
                                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value as any })}
                                >
                                    {Object.keys(RESOURCE_ICONS).map(type => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Quantity"
                                type="number"
                                variant="outlined"
                                size="small"
                                value={newResource.quantity}
                                onChange={(e) => setNewResource({ ...newResource, quantity: parseInt(e.target.value) })}
                            />
                            <TextField
                                label="Unit"
                                variant="outlined"
                                size="small"
                                value={newResource.unit}
                                onChange={(e) => setNewResource({ ...newResource, unit: e.target.value })}
                            />
                            <Button variant="contained" color="success" onClick={handleAddResource}>Save</Button>
                        </div>
                    </div>
                )}

                {/* Resource Grid */}
                {loading ? (
                    <div className="flex justify-center p-12"><CircularProgress /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {resources.map((resource) => (
                            <div key={resource._id} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                {/* Status Stripe */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${resource.quantity > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg ${resource.quantity > 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-red-50 text-red-600'}`}>
                                        {RESOURCE_ICONS[resource.type]}
                                    </div>
                                    <Chip
                                        label={resource.quantity > 0 ? "In Stock" : "Depleted"}
                                        color={resource.quantity > 0 ? "success" : "error"}
                                        size="small"
                                        variant="outlined"
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{resource.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{resource.type}</p>

                                <div className="flex items-end gap-1">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{resource.quantity}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium pb-1">{resource.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
