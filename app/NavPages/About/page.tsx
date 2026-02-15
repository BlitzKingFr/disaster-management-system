"use client";
import React from "react";
import {
    Card,
    CardContent,
    Avatar,
    Chip
} from "@mui/material";
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupsIcon from '@mui/icons-material/Groups';
import PublicIcon from '@mui/icons-material/Public';
import AlgorithmIcon from '@mui/icons-material/AccountTree';
import MapIcon from '@mui/icons-material/Map';

export default function AboutPage() {
    const features = [
        {
            icon: <SecurityIcon fontSize="large" />,
            title: "Hybrid Detection",
            description: "Combines crowdsourcing with external API integration (USGS, OpenWeatherMap) for accurate disaster detection.",
            color: "from-red-500 to-orange-500"
        },
        {
            icon: <AlgorithmIcon fontSize="large" />,
            title: "Smart Algorithms",
            description: "Implements Dijkstra's Algorithm for optimal routing and Merge Sort for incident prioritization.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <MapIcon fontSize="large" />,
            title: "Real-Time Mapping",
            description: "Interactive Leaflet.js maps with live incident markers and route visualization for field agents.",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: <GroupsIcon fontSize="large" />,
            title: "Role-Based Access",
            description: "Secure authentication with distinct permissions for Citizens, Field Agents, Dispatchers, and Admins.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: <SpeedIcon fontSize="large" />,
            title: "Automated Verification",
            description: "Geographic clustering auto-verifies incidents when multiple users report from the same location.",
            color: "from-amber-500 to-yellow-500"
        },
        {
            icon: <PublicIcon fontSize="large" />,
            title: "Resource Management",
            description: "Track and allocate ambulances, medical supplies, personnel, and equipment efficiently.",
            color: "from-indigo-500 to-blue-500"
        }
    ];

    const team = [
        {
            name: "Your Name",
            role: "Full-Stack Developer",
            avatar: "Y",
            color: "from-blue-500 to-indigo-600"
        },
        {
            name: "Project Guide",
            role: "Faculty Advisor",
            avatar: "P",
            color: "from-purple-500 to-pink-600"
        }
    ];

    const techStack = [
        { name: "Next.js 16", category: "Frontend" },
        { name: "MongoDB", category: "Database" },
        { name: "NextAuth.js", category: "Authentication" },
        { name: "Leaflet.js", category: "Mapping" },
        { name: "Material-UI", category: "UI Framework" },
        { name: "Tailwind CSS", category: "Styling" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-6xl font-black mb-6 tracking-tight">
                        About This Project
                    </h1>
                    <p className="text-2xl font-light max-w-3xl mx-auto leading-relaxed opacity-95">
                        A comprehensive disaster management system built for BCA 6th Semester,
                        implementing core CS algorithms and real-world problem solving.
                    </p>
                    <div className="flex justify-center gap-4 mt-8">
                        <Chip
                            label="BCA 6th Semester"
                            className="bg-white/20 backdrop-blur-md text-white font-semibold"
                            size="medium"
                        />
                        <Chip
                            label="Tribhuvan University"
                            className="bg-white/20 backdrop-blur-md text-white font-semibold"
                            size="medium"
                        />
                        <Chip
                            label="2026"
                            className="bg-white/20 backdrop-blur-md text-white font-semibold"
                            size="medium"
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
                        Core Features
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Advanced capabilities designed to revolutionize disaster response coordination
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-800 hover:border-transparent hover:scale-105"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack Section */}
            <div className="bg-white dark:bg-gray-900 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
                            Technology Stack
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Built with modern, industry-standard technologies
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {techStack.map((tech, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-center hover:scale-105 transition-transform border border-gray-200 dark:border-gray-700"
                            >
                                <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                    {tech.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {tech.category}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
                        Project Team
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Dedicated individuals behind this project
                    </p>
                </div>

                <div className="flex justify-center gap-8 flex-wrap">
                    {team.map((member, index) => (
                        <Card
                            key={index}
                            className="w-80 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            <CardContent className="text-center p-8">
                                <Avatar
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        margin: '0 auto 1.5rem',
                                        fontSize: '3rem',
                                        background: `linear-gradient(135deg, ${member.color.split(' ')[1]} 0%, ${member.color.split(' ')[3]} 100%)`
                                    }}
                                >
                                    {member.avatar}
                                </Avatar>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {member.name}
                                </h3>
                                <Chip
                                    label={member.role}
                                    color="primary"
                                    size="medium"
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Academic Compliance Section */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-black mb-8">
                        Academic Compliance
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-2xl font-bold mb-3">✅ Algorithm Implementation</h3>
                            <p className="opacity-90">Dijkstra's Algorithm (Graph Theory) + Merge Sort (Divide & Conquer)</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-2xl font-bold mb-3">✅ Database Design</h3>
                            <p className="opacity-90">Normalized MongoDB schema with relationships</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-2xl font-bold mb-3">✅ Full-Stack Development</h3>
                            <p className="opacity-90">Next.js (Frontend + Backend API)</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-2xl font-bold mb-3">✅ Real-World Problem</h3>
                            <p className="opacity-90">Disaster response automation</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
