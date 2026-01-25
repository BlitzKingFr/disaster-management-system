
import Navbar from "./Navbar";
const Main = () => {
  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 flex flex-col gap-8">
            <section className="relative overflow-hidden rounded-xl bg-slate-900">
                            <div
                                className="min-h-[440px] flex flex-col justify-end p-8 md:p-12 relative z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
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

                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                                <img className="w-full h-full object-cover opacity-60 grayscale-[50%]"
                                    alt="Satellite view of emergency dispatch map"
                                    title="Satellite view of emergency dispatch map"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZtbP-RyJyw__MzYtTvbFEEG-MUeRHUDxKQpBMiqLavc06hBJDIgQO5FgZr5S6z69MGpkFHjr_VtsPmu0JgVyY42Hfg6oRW_EOiTmMfTDKVnOfahGvq1r5EvXiG6FGGytbknmwrnBqG5GU47QuEMeLx4CAHCntKNiyB6-XL61uMROyvjelUPqU7OAmbNqpWbBGvPbBNj67WsjaiqeLR0GovuartviJcYjeSo5w6llQKivty6Za9i2XX8qhwe5hs0ovkPADye3ZkK4" />
                            </div>
                        </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Main