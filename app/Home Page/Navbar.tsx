'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { TextRevealButton } from "@/components/ui/shadcn-io/text-reveal-button";
import { Button } from '@mui/material';
import { useRouter } from "next/navigation";

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Emergency Resource', href: '/Emergencyresource' },
  { label: 'Contact', href: '/NavPages/Contact' },
];

export default function Navbar() {

  const router = useRouter();

  const handleLogin = () => {
    router.push("/NavPages/Login");
  };
  const handleReportIncident = () => {
    router.push("/NavPages/ReportIncident");
  }
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="flex w-full items-center px-6 py-4">
        
       
        <div className="flex flex-1 justify-start">
          <Link href="/" className="text-xl font-semibold text-slate-900">
            <TextRevealButton text="LOGO" />
          </Link>
        </div>

        
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'text-lg font-medium transition-colors hover:text-slate-900',
                pathname === item.href ? 'text-blue-600' : 'text-gray-600'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        
        <div className="flex flex-1 justify-end ">
          <Button
            variant="contained"
            size="medium"
            sx={{
              borderRadius: '8px',
              fontWeight: 600,
              textTransform: 'none', 
              backgroundColor: '#1976d2',
              paddingRight: '20px',
              paddingLeft: '20px',
              marginRight: '12px', 
            }}
            onClick={handleReportIncident}
          >
            
            Report Incident
          </Button>
          <Button
            variant="contained"
            size="medium"
            sx={{
              borderRadius: '8px',
              fontWeight: 600,
              textTransform: 'none', 
              backgroundColor: '#1976d2', 
              
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
          
        </div>

      </div>
    </nav>
  );
}