
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Incident from "@/lib/models/Incident";
import LogoutButton from "@/app/Utilities/LogoutButton";
import { Button } from "@mui/material";
import Link from "next/link";

export default async function UserPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/NavPages/Login");
  }

  await connectDB();

  // Fetch full user details to get role and other info potentially not in session
  const mongoUser = await User.findOne({ email: session.user.email }).lean();

  // Fetch incidents reported by this user
  // We need to handle the case where reportedBy might be string ID. 
  // Session user.id is usually the string representation of _id.
  const incidents = await Incident.find({ reportedBy: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  if (!mongoUser) {
    return <div>User not found</div>;
  }

  // Format date helper
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header / Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative shrink-0">
            {mongoUser.image || session.user.image ? (
              <Image
                src={mongoUser.image || session.user.image || ""}
                alt={mongoUser.name || "User"}
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-4xl text-gray-400">
                {(mongoUser.name?.[0] || "U").toUpperCase()}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900"></div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {mongoUser.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {mongoUser.email}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                {mongoUser.role || "Citizen"}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                Member since {formatDate(mongoUser.createdAt)}
              </span>
            </div>

            {/* Role-Based Action Button */}
            <div className="pt-2 flex flex-wrap gap-3">
              {(() => {
                const role = (mongoUser.role || "citizen").toLowerCase();
                let buttonConfig = {
                  text: "Report Incident",
                  href: "/NavPages/ReportIncident",
                  className: "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20"
                };

                if (role.includes("admin")) {
                  buttonConfig = {
                    text: "Admin Dashboard",
                    href: "/NavPages/Dashboard", // Assuming this is the correct route based on earlier check, if not it might be /NavPages/Admin
                    className: "bg-slate-800 hover:bg-slate-900 text-white shadow-lg shadow-slate-500/20 dark:bg-slate-700 dark:hover:bg-slate-600"
                  };
                } else if (role.includes("dispatcher")) {
                  buttonConfig = {
                    text: "Mission Control",
                    href: "/NavPages/Dashboard", // Using Dashboard as placeholder or if shared
                    className: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                  };
                }

                return (
                  <Link href={buttonConfig.href}>
                    <Button
                      variant="contained"
                      className={`!capitalize !font-bold !py-2 !px-6 !rounded-xl ${buttonConfig.className}`}
                    >
                      {buttonConfig.text}
                    </Button>
                  </Link>
                );
              })()}

              <div className="inline-block">
                <LogoutButton />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 min-w-[200px] text-center">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{incidents.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mt-1">Reports Filed</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Stats or Additional Info (Placeholder for now) */}
          <div className="space-y-8 lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Location</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Nepal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Reports</h2>

            {incidents.length > 0 ? (
              <div className="grid gap-4">
                {incidents.map((incident: any) => (
                  <div key={incident._id} className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${incident.status === 'resolved' ? 'bg-green-500' :
                          incident.status === 'verified' ? 'bg-blue-500' :
                            incident.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{incident.status}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(incident.createdAt)}</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {incident.disasterType}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {incident.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Severity: <span className="font-medium text-gray-900 dark:text-gray-200">{incident.severity}/5</span></span>
                      {incident.address && <span>📍 {incident.address}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No incidents reported yet.</p>
                <Button variant="text" color="primary" href="/NavPages/ReportIncident" className="mt-2">
                  Report an Incident
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

