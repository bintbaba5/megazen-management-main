import React, { useState } from "react";
// import { useRouter } from "next/navigation"; // For redirect after success
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ProfileForm({
  className,
  setOpen,
}: React.ComponentProps<"form"> & { setOpen: (open: boolean) => void }) {
  const [error, setError] = useState("");
  //   const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Call the API route for sign-up
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to another page after successful sign-up (e.g., login or dashboard)
        // router.push("/"); // Adjust the redirect URL as needed
        setOpen(false);
      } else {
        // Show any error that came from the API
        setError(data.error || "Something went wrong during sign-up.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <form
      className={cn("grid items-start gap-4", className)}
      onSubmit={handleSubmit}
    >
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="grid gap-2">
        <Label htmlFor="name">Username</Label>
        <Input name="name" type="text" id="name" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" type="email" id="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" required />
      </div>
      <Button type="submit">Sign Up</Button>
    </form>
  );
}

export default ProfileForm;
