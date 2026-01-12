'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { TextRevealButton } from "@/components/ui/shadcn-io/text-reveal-button"
import { Button } from '@mui/material';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/NavPages/Contact' },

];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="w-full border-b border-gray-200 bg-white">
           <div className="flex w-full items-center justify-between px-6 py-4">

                {/* LOGO */}
                <Link href="/" className="text-xl font-semibold text-slate-900">
                    <TextRevealButton text="LOGO" />
                </Link>

                <div className="flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                'text-lg font-medium transition-colors hover:text-slate-900',
                                pathname === item.href
                                    ? 'text-blue-600'
                                    : 'text-gray-600'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}

                    <Button
                        variant="contained"
                        size="medium"
                        sx={{
                            borderRadius: '8px',
                            fontWeight: 600,
                        }}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </nav>


    );
}
