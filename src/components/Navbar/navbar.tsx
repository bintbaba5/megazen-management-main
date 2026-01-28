import { Bell, LogOut, Search, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../themeToggle";
import { auth } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSettings } from "./components/Settings";
import LogoutButton from "../LogoutButton";
import { NotificationIcon } from "./components/NotificationIcon";
import { SearchNavbar } from "./components/SearchNavbar";
import Modal from "../Modal";

const Navbar = async () => {
  const session = await auth();
  return (
    <div className="flex justify-between items-center w-full mb-7 bg-slate-800 px-4">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        {/* <input
            type="search"
            placeholder="Start type to search groups & products"
            className="pl-10 pr-4 py-2 w-50 md:w-60 border-2  rounded-lg focus:outline-none focus:border-blue-500"
          /> */}
        <div className="pl-3 flex items-center pointer-events-non">
          <Bell className="text-gray-500" size={20} />
        </div>
        <div className=" pointer-events-non">
          <SearchNavbar />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div>
          <ModeToggle />
        </div>
        <div className="hidden md:flex justify-between items-center gap-5">
          <NotificationIcon />
          <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />
          {session ? (
            <div className="flex items-center gap-3 cursor-pointer">
              <Image
                src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full h-full object-cover "
              />
              <span className="font-semibold">{session.user?.name}</span>
            </div>
          ) : (
            // <Link href="/login">
            //   <button
            //     onClick={() => {
            //       sessionStorage.removeItem("token");
            //     }}
            //     className="bg-red-500 text-white px-4 py-2 rounded-md"
            //   >
            //     Logout
            //   </button>
            // </Link>
            <Link href="/api/auth/signin">
              <button className="bg-blue-500 text-white px-2 py-1 rounded-md">
                Login
              </button>
            </Link>
          )}
        </div>

        <DropdownMenuSettings />
        <LogoutButton />
        {/* <Link href="/api/auth/signin">
          <LogOut size={20} />
        </Link> */}
      </div>
    </div>
  );
};

export default Navbar;
