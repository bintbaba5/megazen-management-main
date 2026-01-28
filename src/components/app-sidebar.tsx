"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { usePathname } from "next/navigation"; // Import for current path detection
import { useSession } from "next-auth/react";
import SidebarLogo from "@/common/Loader/SidebarLogo/SidebarLogo";
import menuItems from "@/common/menu/menuItems";

export function AppSidebar() {
  const pathname = usePathname(); // Get the current pathname
  const { data: session } = useSession();
  const userRole = session?.user?.role?.name;

  // Filter menu items based on roles
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles || item.roles.includes(userRole?.toLowerCase())) {
      // If the item has subItems, filter them as well
      if (item.subItems) {
        item.subItems = item.subItems.filter(
          (subItem) =>
            !subItem.roles || subItem.roles.includes(userRole?.toLowerCase())
        );
      }
      return true;
    }
    return false;
  });

  return (
    <Sidebar className="w-64 bg-gray-800 text-white">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-2 text-gray-400 uppercase">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => {
                const isActiveGroup =
                  item.subItems &&
                  item.subItems.some((subItem) =>
                    pathname.startsWith(subItem.url)
                  );
                return item.subItems ? (
                  <Collapsible
                    key={item.title}
                    className="group/collapsible"
                    defaultOpen={isActiveGroup} // Open if there's an active submenu
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                          <div
                            className={`flex items-center gap-3 px-6 py-2 rounded transition-all cursor-pointer ${
                              isActiveGroup
                                ? "dark:bg-gray-800 dark:text-white text-black bg-gray-200"
                                : "dark:hover:bg-gray-800 hover:bg-gray-400  dark:text-white text-black "
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                            <ChevronRight
                              className={`ml-auto ${
                                isActiveGroup ? "hidden" : "block"
                              }`}
                            />
                            <ChevronDown
                              className={`ml-auto ${
                                isActiveGroup ? "block" : "hidden"
                              }`}
                            />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems.map((subItem) => {
                          const isActiveSubItem = pathname.startsWith(
                            subItem.url
                          );
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a
                                  href={subItem.url}
                                  className={`flex items-center gap-3 px-8 py-2 rounded transition-all ${
                                    isActiveSubItem
                                      ? "dark:bg-gray-800 hover:bg-gray-500 hover:text-white dark:text-white text-black bg-gray-200"
                                      : "dark:hover:bg-gray-800 hover:bg-gray-400  dark:text-white text-black"
                                  }`}
                                >
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center gap-3 px-6 py-2 rounded transition-all ${
                          pathname === item.url
                            ? "dark:bg-gray-800 dark:text-white text-black bg-gray-200"
                            : "dark:hover:bg-gray-800 hover:bg-gray-400  dark:text-white text-black"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-4 text-center text-sm text-gray-800 dark:text-gray-400 ">
        <p>&copy; {new Date().getFullYear()} TRISANA TECH.</p>
        <p>All Rights Reserved.</p>
      </SidebarFooter>
    </Sidebar>
  );
}
