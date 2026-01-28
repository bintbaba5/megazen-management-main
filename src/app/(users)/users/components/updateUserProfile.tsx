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
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import UserForm from "./userForm";

const UpdateUserProfile = ({
  user,
  fetchUsers,
}: {
  user: { id: string; name: string; email: string };
  fetchUsers: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleSubmit = async (data: {
    name: string;
    email: string;
    selectedRole: string;
  }) => {
    const response = await fetch("/api/auth/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user.id, ...data }),
    });

    const result = await response.json();

    if (response.ok) {
      // Handle success (e.g., show success message or redirect)
      fetchUsers();
      // console.log("User updated:", result.user);
    } else {
      console.error(result.error);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex justify-end border border-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Update User
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update user</DialogTitle>
            <DialogDescription>
              Make profile changes here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={user}
            onSubmit={handleSubmit}
            setOpen={setOpen}
            isUpdating={true}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Update User</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DialogTitle>Update user</DialogTitle>
          <DialogDescription>
            Make profile changes here. Click save when you&apos;re done.
          </DialogDescription>
        </DrawerHeader>
        <UserForm user={user} onSubmit={handleSubmit} setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UpdateUserProfile;
