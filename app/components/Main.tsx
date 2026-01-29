

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
                  <span className="material-symbols-outlined text-rose-500 text-sm">warning</span>
                  <p className="text-rose-500 text-xs font-bold">Near Capacity</p>
                </div>
              </div>
            </section>


          </div>
        </div>
      </div>
    </main>
  )
}

export default Main