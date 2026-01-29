"use client";
import Map from "@/app/Utilities/Map";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WarningIcon from '@mui/icons-material/Warning';
import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import VolcanoIcon from '@mui/icons-material/Volcano';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import LandslideIcon from '@mui/icons-material/Landslide';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const ReportPage = () => {
    const router = useRouter();

    // Form state
    const [disasterType, setDisasterType] = useState("earthquake");
    const [severity, setSeverity] = useState(5);
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    const handleCancel = () => {
        router.push("/dashboard"); // navigate back
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you can call your API to save report
        console.log({ disasterType, severity, description, location });
        alert("Report submitted successfully!");
        router.push("/dashboard");
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#1a120c]">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-[#493222] bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined"><MedicalServicesIcon /></span>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
                                DMS Unified
                            </h2>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-slate-400 text-sm hidden sm:inline">
                                Emergency Reporting Line: <span className="text-primary font-bold">1-0-2</span>
                            </span>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-slate-200 dark:bg-[#493222] text-slate-900 dark:text-white text-sm font-bold transition-colors hover:bg-slate-300 dark:hover:bg-[#5a3f2b]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Form */}
            <main className="flex-grow py-8 md:py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="mb-10">
                        {/* Step progress */}
                        <div className="flex justify-between items-center relative mb-8">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex flex-col items-center relative z-10">
                                    <div
                                        className={`size-10 rounded-full flex items-center justify-center font-bold ${step === 1
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "bg-slate-200 dark:bg-[#493222] text-slate-500 dark:text-slate-400"
                                            }`}
                                    >
                                        {step}
                                    </div>
                                    <span
                                        className={`mt-2 text-xs font-bold ${step === 1 ? "text-primary" : "text-slate-500"
                                            }`}
                                    >
                                        {["Type", "Details", "Location", "Submit"][step - 1]}
                                    </span>
                                </div>
                            ))}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-[#493222] -translate-y-1/2 z-0"></div>
                            <div className="absolute top-1/2 left-0 w-1/3 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"></div>
                        </div>

                        {/* Form */}
                        <div className="bg-white dark:bg-[#231810] rounded-2xl border border-slate-200 dark:border-[#493222] shadow-2xl overflow-hidden">
                            <div className="p-8">
                                <div className="mb-8">
                                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
                                        New Incident Report
                                    </h1>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        Provide accurate info to help emergency responders coordinate recovery.
                                    </p>
                                </div>
                                <form className="space-y-10" onSubmit={handleSubmit}>
                                    {/* Section 1 - Incident Type */}
                                    <section>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                                            Section 1: Incident Type
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {[
                                                { type: "earthquake", icon: <VolcanoIcon /> },
                                                { type: "flood", icon: <WaterDamageIcon /> },
                                                { type: "fire", icon: <LocalFireDepartmentIcon /> },
                                                { type: "storm", icon: <ThunderstormIcon /> },
                                                { type: "medical", icon: <MedicalServicesIcon /> },
                                                { type: "hazmat", icon: <WarningIcon /> },
                                                { type: "landslide", icon: <LandslideIcon /> },
                                                { type: "other", icon: <MoreHorizIcon /> },
                                            ].map((item) => (
                                                <label key={item.type} className="cursor-pointer group">
                                                    <input
                                                        type="radio"
                                                        name="disaster_type"
                                                        value={item.type}
                                                        className="sr-only peer"
                                                        checked={disasterType === item.type}
                                                        onChange={() => setDisasterType(item.type)}
                                                    />
                                                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-100 dark:border-[#493222] bg-slate-50 dark:bg-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all group-hover:bg-slate-100 dark:group-hover:bg-white/5">
                                                        <span className="material-symbols-outlined text-4xl mb-2 text-slate-400 dark:text-slate-600 group-hover:text-primary transition-colors">
                                                            {item.icon}
                                                        </span>
                                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400 capitalize">
                                                            {item.type}
                                                        </span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Section 2 - Details & Severity */}
                                    <section>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                                            Section 2: Details & Severity
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                    Situation Description
                                                </label>
                                                <textarea
                                                    className="w-full rounded-xl border-slate-200 dark:border-[#493222] bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:ring-primary focus:border-primary p-4"
                                                    placeholder="Describe what you see..."
                                                    rows={4}
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                        Severity Level
                                                    </label>
                                                    <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase rounded tracking-widest">
                                                        Selected: {["Low", "Minor", "Moderate", "High", "Critical"][severity - 1]}
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={1}
                                                    max={5}
                                                    step={1}
                                                    value={severity}
                                                    onChange={(e) => setSeverity(Number(e.target.value))}
                                                    className="w-full h-2 bg-slate-200 dark:bg-[#493222] rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                    <span>Low</span>
                                                    <span>Minor</span>
                                                    <span>Moderate</span>
                                                    <span>High</span>
                                                    <span className="text-rose-500">Critical</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Section 3 - Location */}
                                    <section>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                                            Section 3: Incident Location
                                        </h3>
                                        <Map
                                            onLocationSelect={(lat, lng) => setLocation({ lat, lng })}
                                            initialPosition={[27.7172, 85.3240]}
                                        />
                                        {location && (
                                            <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">
                                                Selected Location: {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
                                            </p>
                                        )}
                                        <input
                                            type="text"
                                            placeholder="Street address or landmark (optional)"
                                            className="w-full rounded-lg border-slate-200 dark:border-[#493222] bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white p-2 mt-2"
                                        />
                                    </section>

                                    {/* Section 4 - Visual Evidence (skip file upload for now) */}

                                    <div className="pt-6 border-t border-slate-200 dark:border-[#493222] flex flex-col sm:flex-row gap-4">
                                        <button
                                            type="button"
                                            onClick={() => alert("Draft saved!")}
                                            className="flex-1 h-14 bg-slate-200 dark:bg-[#493222] text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-[#5a3f2b] transition-colors"
                                        >
                                            Save Draft
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] h-14 bg-primary text-white font-black text-lg rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">send</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportPage;
