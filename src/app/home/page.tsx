"use client";
import {
  Home,
  Package,
  FileText,
  ShoppingCart,
  DollarSign,
  Calendar,
  PieChart,
  User,
  Settings,
  ChevronDown,
  ChevronUp,
  Wallet,
  ShoppingBasket,
  ShoppingBagIcon,
  PackagePlus,
  PackagePlusIcon,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui Button
import { NavButton } from "@/components/NavButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import menuItems from "@/common/menu/menuItems";

const flattenMenuItems = (menuItems) => {
  return menuItems.flatMap((item) => {
    if (item.subItems) {
      return [
        { ...item, url: item.url || "#" }, // Include the parent item
        ...item.subItems.map((subItem) => ({
          ...subItem,
          icon: item.icon, // Use the parent icon for sub-items
          color: item.color, // Use the parent color for sub-items
        })),
      ];
    }
    return [item];
  });
};

export default function Page() {
  const router = useRouter();
  const currentUserRole = "admin"; // Replace with actual user role

  // Filter menu items by role and flatten the array
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(currentUserRole)
  );
  const flattenedMenuItems = flattenMenuItems(filteredMenuItems);

  return (
    <div className="min-h-screen p-4  ">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {flattenedMenuItems.map(
          (item) =>
            item.url != "#" && (
              <NavButton
                key={item.id}
                icon={item.icon}
                label={item.title}
                route={item.url || "#"} // Fallback to "#" if no URL
                color={item.color} // Pass the color prop
              />
            )
        )}
      </div>
    </div>
  );
}
