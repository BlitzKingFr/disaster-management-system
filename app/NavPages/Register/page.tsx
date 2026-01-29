'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Alert, MenuItem } from '@mui/material';
import Link from 'next/link';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'user', label: 'Citizen' },
    { value: 'field_agent', label: 'Field Agent' },
    { value: 'dispatcher', label: 'Dispatcher' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to login after successful registration
      router.push('/login?registered=true');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg py-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join the disaster response network
          </p>
        </div>

        {error && (
          <Alert severity="error" className="mt-4">
            {error}
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <TextField
              required
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
            />

            <TextField
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />

            <TextField
              required
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              variant="outlined"
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              helperText="Minimum 6 characters"
            />

            <TextField
              required
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
            />
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={<PersonAddIcon />}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}