import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // For redirect after success
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/common/Loader";

interface RoleProps {
  id: string;
  name: string;
}
// Props type definition
interface UserFormProps {
  user?: { id: string; name: string; email: string }; // Optional user object for update
  onSubmit: (data: {
    name: string;
    email: string;
    password?: string;
    selectedRole: string;
  }) => Promise<void>; // Function to handle submit
  isUpdating?: boolean; // Flag to indicate if the form is for updating
  setOpen: (open: boolean) => void; // Function to close the dialog
}

const UserForm = ({ user, onSubmit, setOpen, isUpdating }: UserFormProps) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleProps[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUpdating) {
      if (!name || !email) {
        setError("All fields are required.");
        return;
      }

      setLoading(true);
      try {
        await onSubmit({ name, email, selectedRole });
        // Redirect or success handling after submit
      } catch (err) {
        setError("Something went wrong. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
        setOpen(false);
      }
    } else {
      if (!name || !email || !password) {
        setError("All fields are required.");
        return;
      }

      setLoading(true);
      try {
        await onSubmit({ name, email, password, selectedRole });
        // Redirect or success handling after submit
      } catch (err) {
        setError("Something went wrong. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
        setOpen(false);
      }
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const response = await fetch("/api/auth/roles");
    const result = await response.json();
    setRoles(result);
  };
  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <form className={cn("grid items-start gap-4")} onSubmit={handleSubmit}>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="grid gap-2">
        <Label htmlFor="name">Username</Label>
        <Input
          name="name"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Assign Role</Label>
        <Select
          value={selectedRole}
          onValueChange={(role) => setSelectedRole(role)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {!isUpdating && (
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : user ? "Update Profile" : "Create Account"}
      </Button>
    </form>
  );
};

export default UserForm;
