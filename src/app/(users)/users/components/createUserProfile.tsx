"use client";
import React, { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import UserForm from "./userForm";

const CreateUserProfile = ({ fetchUsers }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    selectedRole: string;
  }) => {
    const response = await fetch("/api/auth/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Handle success (e.g., redirect to the login page)
      fetchUsers();
    } else {
      console.error(result.error);
    }
  };

  if (isDesktop) {
    return (
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild className="flex justify-end">
            <Button
              variant="outline"
              className="flex justify-end border border-emerald-500 hover:bg-emerald-500 hover:text-white"
            >
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add user</DialogTitle>
              <DialogDescription>
                Add new users here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <UserForm onSubmit={handleSubmit} setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add User</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add user</DrawerTitle>
          <DrawerDescription>
            dd new users here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <UserForm onSubmit={handleSubmit} setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateUserProfile;
