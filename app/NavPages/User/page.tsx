"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Button,
    TextField,
    CircularProgress,
    Avatar,
    Chip,
    Divider,
    Card,
    CardContent,
    IconButton,
    Tabs,
    Tab,
    Box,
    Tooltip,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface Incident {
    _id: string;
    disasterType: string;
    description: string;
    status: string;
    severity: number;
    createdAt: string;
    verified?: boolean;
}

export default function UserProfilePage() {
    const { data: session, status } = useSession();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(session?.user?.name || "");
    const [saving, setSaving] = useState(false);
    const [myIncidents, setMyIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchMyIncidents();
        }
    }, [session]);

    const fetchMyIncidents = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/reports");
            if (res.ok) {
                const data = await res.json();
                const myReports = data.filter((inc: Incident) =>
                    inc.reportedBy === session?.user?.id
                );
                setMyIncidents(myReports);
            }
        } catch (error) {
            console.error("Failed to fetch incidents", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });

            if (res.ok) {
                alert("Profile updated successfully!");
                setEditing(false);
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
                <CircularProgress size={60} />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
                <Card className="p-8 text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
                </Card>
            </div>
        );
    }

    const getRoleBadgeColor = (role: string) => {
        const r = role?.toLowerCase() || "";
        if (r.includes("admin")) return "error";
        if (r.includes("agent") || r.includes("dispatcher")) return "primary";
        return "default";
    };

    const joinDate = new Date(session.user?.createdAt || Date.now());
    const totalIncidents = myIncidents.length;
    const verifiedIncidents = myIncidents.filter(i => i.verified).length;
    const criticalIncidents = myIncidents.filter(i => i.severity >= 4).length;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            {/* Profile Container */}
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-lg">
                {/* Profile Header - No Cover Photo */}
                <div className="relative px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <Avatar
                                sx={{
                                    width: 168,
                                    height: 168,
                                    border: '4px solid white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    fontSize: '4rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}
                            >
                                {session.user?.name?.charAt(0).toUpperCase() || "U"}
                            </Avatar>
                            <div className="absolute bottom-3 right-3 w-10 h-10 bg-green-500 rounded-full border-4 border-white"></div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 pt-4">
                            {editing ? (
                                <div className="flex items-center gap-2 mb-3">
                                    <TextField
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        sx={{ maxWidth: 300 }}
                                    />
                                    <IconButton
                                        onClick={handleSave}
                                        disabled={saving}
                                        color="primary"
                                        size="small"
                                    >
                                        {saving ? <CircularProgress size={20} /> : <SaveIcon />}
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            setEditing(false);
                                            setName(session.user?.name || "");
                                        }}
                                        size="small"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 mb-3">
                                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                                        {session.user?.name}
                                    </h1>
                                    <IconButton
                                        onClick={() => setEditing(true)}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(0,0,0,0.05)',
                                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-4">
                                <Chip
                                    label={session.user?.role || "Citizen"}
                                    color={getRoleBadgeColor(session.user?.role || "")}
                                    size="small"
                                    icon={<BadgeIcon />}
                                />
                                <Chip
                                    label="Active"
                                    color="success"
                                    size="small"
                                    variant="outlined"
                                />
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <ReportProblemIcon fontSize="small" />
                                    <span><strong>{totalIncidents}</strong> incidents reported</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CalendarMonthIcon fontSize="small" />
                                    <span>Joined {joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="text-center py-4 border-r border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalIncidents}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
                    </div>
                    <div className="text-center py-4 border-r border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <p className="text-2xl font-bold text-blue-600">{verifiedIncidents}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Verified</p>
                    </div>
                    <div className="text-center py-4 border-r border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <p className="text-2xl font-bold text-red-600">{criticalIncidents}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
                    </div>
                    <div className="text-center py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <p className="text-2xl font-bold text-green-600">
                            {totalIncidents > 0 ? ((verifiedIncidents / totalIncidents) * 100).toFixed(0) : 0}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        px: 2
                    }}
                >
                    <Tab label="About" />
                    <Tab label={`Activity (${totalIncidents})`} />
                </Tabs>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* About Info */}
                            <Card variant="outlined">
                                <CardContent>
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <EmailIcon className="text-blue-600 dark:text-blue-400" fontSize="small" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{session.user?.email}</p>
                                            </div>
                                        </div>
                                        <Divider />
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                <BadgeIcon className="text-purple-600 dark:text-purple-400" fontSize="small" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">User ID</p>
                                                <p className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">{session.user?.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Account Details */}
                            <Card variant="outlined">
                                <CardContent>
                                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Account Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                <BadgeIcon className="text-green-600 dark:text-green-400" fontSize="small" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{session.user?.role || "Citizen"}</p>
                                            </div>
                                        </div>
                                        <Divider />
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                                <CalendarMonthIcon className="text-amber-600 dark:text-amber-400" fontSize="small" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {joinDate.toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Incident Reports</h3>
                            {myIncidents.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <ReportProblemIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                    <p className="text-gray-500 dark:text-gray-400">No incidents reported yet</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                        Start contributing by reporting incidents in your area
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myIncidents.map((incident) => (
                                        <Card key={incident._id} variant="outlined" className="hover:shadow-md transition-shadow">
                                            <CardContent>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-bold text-gray-900 dark:text-white">
                                                                {incident.disasterType}
                                                            </h4>
                                                            {incident.verified && (
                                                                <Tooltip title="Verified by system">
                                                                    <VerifiedIcon className="text-blue-500" fontSize="small" />
                                                                </Tooltip>
                                                            )}
                                                            <Chip
                                                                label={`Severity ${incident.severity}`}
                                                                size="small"
                                                                color={incident.severity >= 4 ? "error" : "warning"}
                                                            />
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                            {incident.description}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span>
                                                                {new Date(incident.createdAt).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                            <Chip
                                                                label={incident.status}
                                                                size="small"
                                                                variant="outlined"
                                                                color={
                                                                    incident.status === 'completed' ? 'success' :
                                                                        incident.status === 'assigned' ? 'primary' :
                                                                            'default'
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
