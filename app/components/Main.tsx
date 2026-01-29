
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WarningIcon from '@mui/icons-material/Warning';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';


const Main = () => {
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
                  <div className="flex flex-wrap gap-4">
                    <button
                      className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                      Report Incident Now
                    </button>
                    <button
                      className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white/10 backdrop-blur-md border border-white/20 text-white text-base font-bold hover:bg-white/20 transition-all">
                      Agency Dashboard
                    </button>
                  </div>
                </div>
              </div>
              {/* Buttons*/}
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
                {/* Alert Item 1 */}
                <div
                  className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500">
                  <span className="material-symbols-outlined text-rose-500 mt-0.5"><WarningIcon /></span>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white text-sm font-bold leading-snug">
                      Wildfire Warning - Sector B</p>
                    <div className="flex justify-between items-center mt-1">
                      <span
                        className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Critical</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px]">14:22 PM</span>
                    </div>
                  </div>
                </div>
                {/* Alert Item 2 */}
                <div
                  className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                  <span className="material-symbols-outlined text-blue-500 mt-0.5"><WaterDropIcon /></span>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white text-sm font-bold leading-snug">Flash
                      Flood Watch - Zone 4</p>
                    <div className="flex justify-between items-center mt-1">
                      <span
                        className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Elevated</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px]">13:45 PM</span>
                    </div>
                  </div>
                </div>
                {/* Alert Item 3 */}
                <div
                  className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500">
                  <span
                    className="material-symbols-outlined text-orange-500 mt-0.5"><MedicalServicesIcon /></span>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white text-sm font-bold leading-snug">Medical
                      Emergency - Downtown</p>
                    <div className="flex justify-between items-center mt-1">
                      <span
                        className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Standard</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px]">13:10 PM</span>
                    </div>
                  </div>
                </div>
                {/* Alert Item 4 */}
                <div
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-slate-400">
                  <span className="material-symbols-outlined text-slate-500 mt-0.5"><LocalShippingIcon /></span>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white text-sm font-bold leading-snug">
                      Resource Dispatch - Sector A</p>
                    <div className="flex justify-between items-center mt-1">
                      <span
                        className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">Logistics</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px]">12:55 PM</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
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
                    className="font-bold">9-1-1</span></li>
                  <li className="flex justify-between"><span>DMS HQ:</span> <span
                    className="font-bold">1-800-DMS-BASE</span></li>
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