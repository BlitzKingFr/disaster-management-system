
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";
import LogoutButton from "@/app/Utilities/LogoutButton";
export default async function UserPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/NavPages/Login");
  }

  const { user } = session;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full space-y-6">
        <div className="flex items-center gap-4">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name ?? "User avatar"}
              width={72}
              height={72}
              className="rounded-full border border-gray-300"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name ?? "User"}
            </h1>
            {user.email && (
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            )}
          </div>
        </div>
        <LogoutButton />


        <p className="text-sm text-gray-600 dark:text-gray-400">
          This is your account area. More profile details and settings can be added here later.
        </p>
      </div>
    </div>
  );
}

