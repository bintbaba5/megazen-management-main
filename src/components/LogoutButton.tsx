"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
      //   className="bg-red-500 text-white px-4 py-2 rounded"
    >
      <LogOut size={20} />
    </button>
  );
}
