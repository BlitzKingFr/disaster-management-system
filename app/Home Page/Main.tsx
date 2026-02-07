"use client";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WarningIcon from '@mui/icons-material/Warning';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import VolcanoIcon from '@mui/icons-material/Volcano';
import LandslideIcon from '@mui/icons-material/Landslide';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


function mergeSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compare);
  const right = mergeSort(arr.slice(mid), compare);
  const merged: T[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    merged.push(compare(left[i], right[j]) >= 0 ? left[i++]! : right[j++]!);
  }
  return merged.concat(left.slice(i), right.slice(j));
}

const SEVERITY_LABELS = ["Low", "Minor", "Moderate", "High", "Critical"] as const;
const DISASTER_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  earthquake: { icon: <VolcanoIcon />, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-500" },
  flood: { icon: <WaterDamageIcon />, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-500" },
  fire: { icon: <LocalFireDepartmentIcon />, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-500" },
  storm: { icon: <ThunderstormIcon />, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20", border: "border-indigo-500" },
  medical: { icon: <MedicalServicesIcon />, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-500" },
  hazmat: { icon: <WarningIcon />, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-500" },
  landslide: { icon: <LandslideIcon />, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-500" },
  other: { icon: <MoreHorizIcon />, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-400" },
};

export type IncidentItem = {
  _id: string;
  disasterType: string;
  severity: number;
  description: string;
  address?: string;
  status: string;
  createdAt: string;
};

const Main = () => {
  const router = useRouter();
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = mergeSort(data, (a, b) => {
            if (a.severity !== b.severity) return a.severity - b.severity;
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
          setIncidents(sorted);
        }
      })
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleReportIncident = () => {
    router.push("/NavPages/ReportIncident");
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };
  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-xl bg-slate-900">
              <div className="min-h-[440px] flex flex-col justify-end p-8 md:p-12 relative z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <div className="max-w-2xl">
                  <h1
                    className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
                    Unified Response.<br />Real-Time Recovery.
                  </h1>
                  <p className="text-slate-200 text-base md:text-lg font-normal mb-8 leading-relaxed">
                    Coordinate emergency responses, manage field personnel, and allocate resources
                    efficiently across multiple sectors in high-stress scenarios.
                  </p>
                  {/* Buttons*/}
                  <div className="flex flex-wrap gap-4">
                    <button
                      className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                      onClick={handleReportIncident}>
                      Report Incident Now
                    </button>
                    <button
                      className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white/10 backdrop-blur-md border border-white/20 text-white text-base font-bold hover:bg-white/20 transition-all">
                      Agency Dashboard
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                <img className="w-full h-full object-cover opacity-60 grayscale-[50%]"
                  alt="Satellite view of emergency dispatch map"
                  title="Satellite view of emergency dispatch map"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZtbP-RyJyw__MzYtTvbFEEG-MUeRHUDxKQpBMiqLavc06hBJDIgQO5FgZr5S6z69MGpkFHjr_VtsPmu0JgVyY42Hfg6oRW_EOiTmMfTDKVnOfahGvq1r5EvXiG6FGGytbknmwrnBqG5GU47QuEMeLx4CAHCntKNiyB6-XL61uMROyvjelUPqU7OAmbNqpWbBGvPbBNj67WsjaiqeLR0GovuartviJcYjeSo5w6llQKivty6Za9i2XX8qhwe5hs0ovkPADye3ZkK4" />
              </div>
            </section>
            {/* Stats*/}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-[#684831] bg-white dark:bg-background-dark shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Personnel
                  </p>
                  <span className="material-symbols-outlined text-primary text-xl"></span>
                </div>
                <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">1,248</p>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-emerald-500 text-sm"></span>
                  <p className="text-emerald-500 text-xs font-bold">+12% from last hour</p>
                </div>
              </div>
              <div
                className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-[#684831] bg-white dark:bg-background-dark shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Operations</p>
                  <span className="material-symbols-outlined text-primary text-xl"></span>
                </div>
                <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">42</p>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-emerald-500 text-sm"></span>
                  <p className="text-emerald-500 text-xs font-bold">+5 new today</p>
                </div>
              </div>
              <div
                className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-[#684831] bg-white dark:bg-background-dark shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Resource Load</p>
                  <span className="material-symbols-outlined text-primary text-xl"></span>
                </div>
                <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">85%</p>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-rose-500 text-sm"></span>
                  <p className="text-rose-500 text-xs font-bold">Near Capacity</p>
                </div>
              </div>
            </section>
            {/* Operational Focus Section Header */}
            <div>
              <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">
                Priority Resources</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Quick access to essential disaster
                response tools and protocols.</p>
            </div>
            {/* Resource Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-[#493222] bg-white dark:bg-[#2b1d14] hover:border-primary transition-colors cursor-pointer group">
                <div
                  className="size-12 rounded-lg bg-slate-100 dark:bg-[#493222] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined"><MenuBookIcon /></span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Field Operations Manual</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Updated June 2024</p>
                </div>
              </div>
              <div
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-[#493222] bg-white dark:bg-[#2b1d14] hover:border-primary transition-colors cursor-pointer group">
                <div
                  className="size-12 rounded-lg bg-slate-100 dark:bg-[#493222] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined"><LocalShippingIcon /></span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Logistics Portal</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Inventory Tracking</p>
                </div>
              </div>
            </div>
          </div>
          {/* Right Sidebar - Active Alerts */}
          <aside className="lg:col-span-4">
            <div
              className="sticky top-24 flex flex-col gap-6 bg-white dark:bg-[#231810] rounded-xl border border-slate-200 dark:border-[#493222] p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Active
                    Alerts</h2>
                  <p className="text-slate-500 dark:text-[#cba990] text-sm font-normal">Field live updates
                  </p>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
              </div>
              <div className="flex flex-col gap-3">
                {loading ? (
                  <p className="text-slate-500 dark:text-slate-400 text-sm py-4 text-center">Loading alerts…</p>
                ) : incidents.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-sm py-4 text-center">No active alerts</p>
                ) : (
                  incidents.map((inc) => {
                    const cfg = DISASTER_CONFIG[inc.disasterType] ?? DISASTER_CONFIG.other;
                    const severityLabel = SEVERITY_LABELS[inc.severity - 1] ?? "Unknown";
                    const title = inc.address
                      ? `${inc.disasterType.charAt(0).toUpperCase() + inc.disasterType.slice(1)} - ${inc.address}`
                      : inc.description.slice(0, 60) + (inc.description.length > 60 ? "…" : "");
                    return (
                      <div
                        key={inc._id}
                        className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${cfg.bg} ${cfg.border}`}
                      >
                        <span className={`material-symbols-outlined mt-0.5 ${cfg.color}`}>{cfg.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 dark:text-white text-sm font-bold leading-snug truncate" title={inc.description}>
                            {title}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                              {severityLabel}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                              {formatTime(inc.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <button
                onClick={() => router.push("/NavPages/Archive")}
                className="w-full flex cursor-pointer items-center justify-center rounded-lg h-11 px-4 border border-slate-200 dark:border-[#493222] text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                View Archive
              </button>
              <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="text-primary text-sm font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm"><ContactPhoneIcon /></span>
                  Hotline Directory
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  <li className="flex justify-between"><span>Fire/Rescue:</span> <span
                    className="font-bold">1-0-0</span></li>
                  <li className="flex justify-between"><span>DMS HQ:</span> <span
                    className="font-bold">1000-DMS-69</span></li>
                  <li className="flex justify-between"><span>Logistics:</span> <span className="font-bold">EXT
                    402</span></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

    </main >
  )
}

export default Main