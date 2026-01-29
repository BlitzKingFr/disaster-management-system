import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const Footer = () => {
  return (
    <div>
      <footer className="bg-[#2B2B2B] text-white border-t border-[#3A3A3A] py-8">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-primary/50 rounded flex items-center justify-center text-white">
              <HealthAndSafetyIcon />
            </div>
            <span className="text-sm font-bold text-white dark:text-white">LOGO</span>
          </div>
          <div className="flex gap-6">
            <a className="text-medium font-medium text-white dark:text-slate-400 hover:text-blue-600" href="#">Privacy Policy</a>
            <a className="text-medium font-medium text-white dark:text-slate-400 hover:text-blue-600" href="#">Terms of Service</a>
            <a className="text-medium font-medium text-white dark:text-slate-400 hover:text-blue-600" href="#">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer