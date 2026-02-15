'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Button, Avatar, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { signOut } from 'next-auth/react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Resources', href: '/Emergencyresource' },
  { label: 'Contact', href: '/NavPages/Contact' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const handleProfile = () => {
    handleClose();
    router.push("/NavPages/User");
  };

  const handleDashboard = () => {
    handleClose();
    router.push("/NavPages/Dashboard");
  };

  const handleUserManagement = () => {
    handleClose();
    router.push("/NavPages/UserManagement");
  };

  const handleLogout = async () => {
    handleClose();
    await signOut({ callbackUrl: '/' });
  };

  const isAdmin = session?.user?.role?.toLowerCase().includes("admin");
  const isAgent = session?.user?.role?.toLowerCase().includes("agent") || session?.user?.role?.toLowerCase().includes("dispatcher");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm">
      <div className="flex w-full items-center px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex flex-1 justify-start">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl">D</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DisasterMS
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                pathname === item.href
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex flex-1 justify-end items-center gap-3">
          <Button
            variant="contained"
            size="medium"
            startIcon={<ReportProblemIcon />}
            sx={{
              borderRadius: '12px',
              fontWeight: 700,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                boxShadow: '0 6px 20px 0 rgba(239, 68, 68, 0.5)',
              },
              paddingX: 3,
            }}
            onClick={handleReportIncident}
          >
            Report Incident
          </Button>

          {session?.user ? (
            <>
              <button
                type="button"
                onClick={handleClick}
                className="flex items-center focus:outline-none"
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    border: '3px solid',
                    borderColor: 'primary.main',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    minWidth: 220,
                    borderRadius: 3,
                    mt: 1.5,
                    '& .MuiMenuItem-root': {
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.user.email}
                  </p>
                </div>
                <Divider />
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  My Profile
                </MenuItem>
                {(isAdmin || isAgent) && (
                  <MenuItem onClick={handleDashboard}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    Dashboard
                  </MenuItem>
                )}
                {isAdmin && (
                  <MenuItem onClick={handleUserManagement}>
                    <ListItemIcon>
                      <AdminPanelSettingsIcon fontSize="small" />
                    </ListItemIcon>
                    User Management
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <span className="text-red-600">Logout</span>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              size="medium"
              sx={{
                borderRadius: '12px',
                fontWeight: 700,
                textTransform: 'none',
                borderWidth: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderWidth: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderColor: 'transparent',
                },
                paddingX: 3,
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