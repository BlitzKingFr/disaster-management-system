"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, TextField, Alert } from "@mui/material";
import Link from "next/link";
import LoginIcon from "@mui/icons-material/Login";
import GoogleIcon from "@mui/icons-material/Google";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to DisasterMS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Emergency Response Coordination Platform
          </p>
        </div>

        {error && <Alert severity="error">{error}</Alert>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={<LoginIcon />}
            sx={{ py: 1.5, fontWeight: 600, textTransform: "none" }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            sx={{ py: 1.5, fontWeight: 600, textTransform: "none" }}
          >
            Sign in with Google
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/NavPages/Register" className="text-blue-600 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
