"use client";

import { signOut } from "next-auth/react";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
      sx={{ textTransform: "none" }}
    >
      Logout
    </Button>
  );
}
