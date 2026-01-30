'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { TextRevealButton } from "@/components/ui/shadcn-io/text-reveal-button";
import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Emergency Resource', href: '/Emergencyresource' },
  { label: 'Contact', href: '/NavPages/Contact' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleLogin = () => {
    router.push("/NavPages/Login");
  };

  const handleReportIncident = () => {
    if (!session && status !== "loading") {
      router.push("/NavPages/Login");
      return;
    }
    router.push("/NavPages/ReportIncident");
  };

  const handleUserClick = () => {
    router.push("/NavPages/User");
  };

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

        <div className="flex flex-1 justify-end items-center gap-3">
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
              marginRight: '4px',
            }}
            onClick={handleReportIncident}
          >
            Report Incident
          </Button>

          {session?.user ? (
            <button
              type="button"
              onClick={handleUserClick}
              className="flex items-center focus:outline-none"
            >
              <img
                src={session.user.image ?? '/default-avatar.png'}
                alt={session.user.name ?? 'User avatar'}
                className="h-10 w-10 rounded-full border border-gray-300 cursor-pointer"
              />
            </button>
          ) : (
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
              disabled={status === "loading"}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}