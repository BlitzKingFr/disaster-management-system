'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { TextRevealButton } from "@/components/ui/shadcn-io/text-reveal-button";
import { Button } from '@mui/material';
import { useSession, signOut } from 'next-auth/react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Emergency Resource', href: '/emergencyresource' },
  { label: 'Contact', href: '/NavPages/Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="flex w-full items-center px-6 py-4">

        {/* Logo */}
        <div className="flex flex-1 justify-start">
          <Link href="/" className="text-xl font-semibold text-slate-900">
            <TextRevealButton text="LOGO" />
          </Link>
        </div>

        {/* Navigation */}
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

        {/* Auth / Actions */}
        <div className="flex flex-1 justify-end items-center gap-3">
          {status === 'authenticated' ? (
            <>
              <span className="text-sm text-gray-700">
                {session.user?.name}
              </span>

              <Button
                variant="outlined"
                onClick={() => signOut()}
                sx={{ textTransform: 'none' }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                href="/report-incident"
                sx={{ textTransform: 'none' }}
              >
                Report Incident
              </Button>

              <Button
                variant="outlined"
                href="/NavPages/Login"
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
