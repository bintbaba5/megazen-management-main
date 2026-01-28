"use client";
import React, { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import Loader from "@/common/Loader";

const ChangeUserPassword = ({
  user,
  fetchUsers,
}: {
  user: { id: string; name: string; email: string };
  fetchUsers: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setPassword("");
    setConfirmPassword("");
    setError("");
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the page reload

    setLoading(true);
    if (!password || !confirmPassword) {
      setLoading(false);
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }
    const response = await fetch("/api/auth/user/changePassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user.id, password, confirmPassword }),
    });

    const result = await response.json();

    if (response.ok) {
      // Handle success (e.g., show success message or redirect)
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
      fetchUsers();
      // console.log("User updated:", result.user);
    } else {
      setLoading(true);

      console.error(result.error);
    }
  };

  const passwordForm = () => {
    
    return (
      <form className={cn("grid items-start gap-4")} onSubmit={handleSubmit}>
        {error && <p className="text-red-500">{error}</p>}
        <div className="relative grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div
            className="absolute top-7 right-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </div>
        </div>
        <div className="relative grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div
            className="absolute top-7 right-2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <Eye /> : <EyeClosed />}
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Change Password"}
        </Button>
      </form>
    );
  };
  if (isDesktop) {
    if (loading) {
      return (
        <div>
          <Loader /> 
        </div>
      );
    }
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex justify-end border border-yellow-500 hover:bg-yellow-500 hover:text-white"
          >
            Change Password
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Make passwor changes here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          {passwordForm()}
        </DialogContent>
      </Dialog>
    );
  }
  if (loading) {
    return (
      <div>
        <Loader /> 
      </div>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Change Password</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Make passwor changes here. Click save when you&apos;re done.
          </DialogDescription>
        </DrawerHeader>
        {passwordForm()}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ChangeUserPassword;
