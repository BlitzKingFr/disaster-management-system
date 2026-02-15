"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openPromoteModal, setOpenPromoteModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  const isAdmin = session?.user?.role?.toLowerCase().includes("admin");

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async () => {
    if (!selectedUser || !newRole) return;

    try {
      const res = await fetch(`/api/users/${selectedUser._id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        alert(`User ${selectedUser.name} promoted to ${newRole}`);
        setOpenPromoteModal(false);
        fetchUsers();
      } else {
        alert("Failed to update role");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-500 mt-2">Only administrators can access user management.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                  <AdminPanelSettingsIcon className="text-indigo-600 dark:text-indigo-400" fontSize="large" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  User Management
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg ml-16">
                Manage user roles and permissions for the disaster response system.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg">
                <p className="text-sm font-medium opacity-90">Total Users</p>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => {
            const isAdminUser = user.role?.toLowerCase().includes("admin");
            const isAgent = user.role?.toLowerCase().includes("agent") || user.role?.toLowerCase().includes("dispatcher");

            return (
              <div
                key={user._id}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500"
              >
                {/* User Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isAdminUser ? 'bg-red-100 dark:bg-red-900/30' :
                      isAgent ? 'bg-blue-100 dark:bg-blue-900/30' :
                        'bg-gray-100 dark:bg-gray-800'
                      }`}>
                      <PersonIcon className={`${isAdminUser ? 'text-red-600 dark:text-red-400' :
                        isAgent ? 'text-blue-600 dark:text-blue-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`} fontSize="large" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="mb-4">
                  <Chip
                    label={user.role || "Citizen"}
                    color={
                      isAdminUser ? "error" :
                        isAgent ? "primary" :
                          "default"
                    }
                    size="medium"
                    icon={isAdminUser ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                    className="font-semibold"
                  />
                </div>

                {/* Metadata */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Member Since
                  </p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<AdminPanelSettingsIcon />}
                  onClick={() => {
                    setSelectedUser(user);
                    setNewRole(user.role || "user");
                    setOpenPromoteModal(true);
                  }}
                  className="group-hover:scale-105 transition-transform"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    }
                  }}
                >
                  Change Role
                </Button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {users.length === 0 && !loading && (
          <div className="text-center py-20">
            <PersonIcon className="text-gray-300 dark:text-gray-700 mx-auto mb-4" style={{ fontSize: 80 }} />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Users Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Users will appear here once they register.</p>
          </div>
        )}

        {/* Promote Modal */}
        <Dialog
          open={openPromoteModal}
          onClose={() => setOpenPromoteModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }
          }}
        >
          <DialogTitle className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <AdminPanelSettingsIcon fontSize="large" />
              <div>
                <h2 className="text-2xl font-bold">Update User Role</h2>
                <p className="text-sm opacity-90">Modify system permissions</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent className="mt-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <strong>User:</strong>
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedUser?.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedUser?.email}
                </p>
              </div>

              <TextField
                select
                label="New Role"
                fullWidth
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                variant="outlined"
                size="medium"
              >
                <MenuItem value="user">
                  <div className="flex items-center gap-2">
                    <PersonIcon fontSize="small" />
                    <div>
                      <p className="font-semibold">Citizen</p>
                      <p className="text-xs text-gray-500">Standard User - Can report incidents</p>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem value="field_agent">
                  <div className="flex items-center gap-2">
                    <PersonIcon fontSize="small" className="text-blue-600" />
                    <div>
                      <p className="font-semibold">Field Agent</p>
                      <p className="text-xs text-gray-500">Responds to assigned incidents</p>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem value="dispatcher">
                  <div className="flex items-center gap-2">
                    <PersonIcon fontSize="small" className="text-blue-600" />
                    <div>
                      <p className="font-semibold">Dispatcher</p>
                      <p className="text-xs text-gray-500">Coordinates field operations</p>
                    </div>
                  </div>
                </MenuItem>
                <MenuItem value="Admin">
                  <div className="flex items-center gap-2">
                    <AdminPanelSettingsIcon fontSize="small" className="text-red-600" />
                    <div>
                      <p className="font-semibold">Administrator</p>
                      <p className="text-xs text-gray-500">Full system access</p>
                    </div>
                  </div>
                </MenuItem>
              </TextField>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <strong>Warning:</strong> Changing roles affects system access permissions immediately.
                </p>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="p-6 bg-gray-50 dark:bg-gray-900">
            <Button
              onClick={() => setOpenPromoteModal(false)}
              variant="outlined"
              size="large"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePromote}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                }
              }}
            >
              Update Role
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
