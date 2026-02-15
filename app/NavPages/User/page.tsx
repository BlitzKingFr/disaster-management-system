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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage user roles and permissions for the disaster response system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user._id} className="hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PersonIcon className="text-gray-400" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <Chip
                    label={user.role || "Citizen"}
                    color={
                      user.role?.toLowerCase().includes("admin") ? "error" :
                        user.role?.toLowerCase().includes("agent") || user.role?.toLowerCase().includes("dispatcher") ? "primary" :
                          "default"
                    }
                    size="small"
                  />
                </div>

                <p className="text-xs text-gray-400 mb-4">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>

                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<AdminPanelSettingsIcon />}
                  onClick={() => {
                    setSelectedUser(user);
                    setNewRole(user.role || "user");
                    setOpenPromoteModal(true);
                  }}
                >
                  Change Role
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Promote Modal */}
        <Dialog open={openPromoteModal} onClose={() => setOpenPromoteModal(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Update User Role</DialogTitle>
          <DialogContent>
            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                User: <strong>{selectedUser?.name}</strong>
              </p>
              <TextField
                select
                label="New Role"
                fullWidth
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <MenuItem value="user">Citizen (Standard User)</MenuItem>
                <MenuItem value="field_agent">Field Agent</MenuItem>
                <MenuItem value="dispatcher">Dispatcher</MenuItem>
                <MenuItem value="Admin">Administrator</MenuItem>
              </TextField>
              <p className="text-xs text-gray-500 mt-4 italic">
                ⚠️ Warning: Changing roles affects system access permissions.
              </p>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPromoteModal(false)}>Cancel</Button>
            <Button onClick={handlePromote} variant="contained" color="primary">
              Update Role
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
