"use client";

import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WarningIcon from "@mui/icons-material/Warning";
import WaterDamageIcon from "@mui/icons-material/WaterDamage";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import VolcanoIcon from "@mui/icons-material/Volcano";
import LandslideIcon from "@mui/icons-material/Landslide";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import Link from "next/link";

function mergeSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compare);
  const right = mergeSort(arr.slice(mid), compare);
  const merged: T[] = [];
  let i = 0,
    j = 0;
  while (i < left.length && j < right.length) {
    merged.push(compare(left[i]!, right[j]!) >= 0 ? left[i++]! : right[j++]!);
  }
  return merged.concat(left.slice(i), right.slice(j));
}

const SEVERITY_LABELS = ["Low", "Minor", "Moderate", "High", "Critical"] as const;
const DISASTER_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  earthquake: {
    icon: <VolcanoIcon />,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-500",
  },
  flood: {
    icon: <WaterDamageIcon />,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-500",
  },
  fire: {
    icon: <LocalFireDepartmentIcon />,
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-500",
  },
  storm: {
    icon: <ThunderstormIcon />,
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-500",
  },
  medical: {
    icon: <MedicalServicesIcon />,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-500",
  },
  hazmat: {
    icon: <WarningIcon />,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-500",
  },
  landslide: {
    icon: <LandslideIcon />,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-500",
  },
  other: {
    icon: <MoreHorizIcon />,
    color: "text-slate-600",
    bg: "bg-slate-50 dark:bg-slate-800/50",
    border: "border-slate-400",
  },
};

type IncidentItem = {
  _id: string;
  disasterType: string;
  severity: number;
  description: string;
  address?: string;
  status: string;
  createdAt: string;
};

export default function ArchivePage() {
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports?archive=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = mergeSort(data, (a, b) => {
            if (a.severity !== b.severity) return b.severity - a.severity;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setIncidents(sorted);
        }
      })
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#1a120c]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium mb-6"
        >
          <ArrowBackIcon fontSize="small" /> Back to Home
        </Link>
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Alert Archive</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">All reported incidents and alerts</p>
        </header>

        {loading ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">Loading archive…</p>
        ) : incidents.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">No alerts in archive</p>
        ) : (
          <div className="flex flex-col gap-3">
            {incidents.map((inc) => {
              const cfg = DISASTER_CONFIG[inc.disasterType] ?? DISASTER_CONFIG.other;
              const severityLabel = SEVERITY_LABELS[inc.severity - 1] ?? "Unknown";
              const title = inc.address
                ? `${inc.disasterType.charAt(0).toUpperCase() + inc.disasterType.slice(1)} - ${inc.address}`
                : inc.description.slice(0, 60) + (inc.description.length > 60 ? "…" : "");
              return (
                <div
                  key={inc._id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${cfg.bg} ${cfg.border} border border-slate-200 dark:border-[#493222]`}
                >
                  <span className={`material-symbols-outlined mt-0.5 ${cfg.color}`}>{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-white font-bold leading-snug">{title}</p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">{inc.description}</p>
                    <div className="flex flex-wrap justify-between items-center gap-2 mt-2">
                      <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                        {severityLabel}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs capitalize">{inc.status}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-xs">{formatDate(inc.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
