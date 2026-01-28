"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  Package,
  PieChart,
  Settings,
  ShoppingCart,
  Smile,
  User,
  Wallet,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import Modal from "@/components/Modal";
import menuItems from "@/common/menu/menuItems";

export function SearchNavbar() {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleNavigation = (url: string) => {
    console.log(url);
    router.push(url);
    setIsOpen(false); // Close the modal after navigation
  };

  return (
    <Modal
      title="Type a command or search..."
      description="Search for groups and products"
      open={isOpen}
      setOpen={setIsOpen}
      triggerText="Type a command or search..."
      cancelText="cancel"
      formComponent={
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput
            placeholder="Type a command or search..."
            value={inputValue}
            onInput={handleInputChange}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {/* Render menu items dynamically */}
            {/* {inputValue && ( */}
            <CommandGroup heading="Main Menus">
              {menuItems.map((menu) => (
                <div key={menu.title}>
                  <CommandItem
                    onSelect={() => menu.url && handleNavigation(menu.url)}
                  >
                    <menu.icon className="w-5 h-5" />
                    <span>{menu.title}</span>
                  </CommandItem>
                  <CommandSeparator />
                  <CommandGroup heading={menu.title}>
                    {menu.subItems?.map((subItem) => (
                      <CommandItem
                        key={subItem.title}
                        onSelect={() =>
                          subItem.url && handleNavigation(subItem.url)
                        }
                      >
                        <menu.icon className="w-5 h-5" />
                        <span>{subItem.title}</span>
                        <CommandShortcut>{subItem?.command}</CommandShortcut>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              ))}
            </CommandGroup>
            {/* )} */}
            <CommandSeparator />
            {/* Settings Group */}
            {/* <CommandGroup heading="Settings">
              <CommandItem onSelect={() => handleNavigation("/profile")}>
                <User />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleNavigation("/billing")}>
                <CreditCard />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleNavigation("/settings")}>
                <Settings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup> */}
          </CommandList>
        </Command>
      }
    />
  );
}
