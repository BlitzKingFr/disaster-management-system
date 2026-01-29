import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2B2B2B] dark:bg-[#1a1410] text-white border-t border-[#3A3A3A] dark:border-[#493222]">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 bg-primary/80 rounded flex items-center justify-center text-white">
                <HealthAndSafetyIcon />
              </div>
              <span className="text-lg font-bold text-white">DisasterMS</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Unified disaster response platform for Nepal. Coordinating emergency services with real-time data and intelligent routing.
            </p>
            <div className="flex gap-3">
              <a href="#" title="Facebook" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FacebookIcon fontSize="small" />
              </a>
              <a href="#" title="Twitter" className="text-gray-400 hover:text-blue-400 transition-colors">
                <TwitterIcon fontSize="small" />
              </a>
              <a href="#" title="LinkedIn" className="text-gray-400 hover:text-blue-400 transition-colors">
                <LinkedInIcon fontSize="small" />
              </a>
              <a href="#" title="GitHub" className="text-gray-400 hover:text-blue-400 transition-colors">
                <GitHubIcon fontSize="small" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold text-white uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/Emergencyresource" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Emergency Resources
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/NavPages/Contact" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold text-white uppercase mb-4">Emergency Hotlines</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <PhoneIcon fontSize="small" className="text-red-500" />
                <span>Police: <span className="font-bold text-white">100</span></span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <PhoneIcon fontSize="small" className="text-red-500" />
                <span>Fire: <span className="font-bold text-white">101</span></span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <PhoneIcon fontSize="small" className="text-red-500" />
                <span>Ambulance: <span className="font-bold text-white">102</span></span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <PhoneIcon fontSize="small" className="text-red-500" />
                <span>NEOC: <span className="font-bold text-white">1130000</span></span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold text-white uppercase mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <LocationOnIcon fontSize="small" className="text-primary mt-0.5" />
                <span>Birtamode,Jhapa Nepal</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <EmailIcon fontSize="small" className="text-primary" />
                <a href="mailto:support@disasterms.np" className="hover:text-blue-400 transition-colors">
                  support@disasterms.np
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <PhoneIcon fontSize="small" className="text-primary" />
                <a href="tel:+9771234567890" className="hover:text-blue-400 transition-colors">
                  +977 1234567890
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#3A3A3A] dark:border-[#493222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {currentYear} DisasterMS. All rights reserved. | 
              <span className="ml-1 text-gray-500">BCA  Project-II  - Tribhuvan University</span>
            </p>

            {/* Links */}
            <div className="flex gap-6">
              <a 
                href="/privacy" 
                className="text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </a>
              <a 
                href="/status" 
                className="text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors"
              >
                System Status
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;