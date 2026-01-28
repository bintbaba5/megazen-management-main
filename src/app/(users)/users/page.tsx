"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast"; // Import the toast hook
import Loader from "@/common/Loader"; // Assuming this component exists
import CreateUserProfile from "./components/createUserProfile";
import UpdateUserProfile from "./components/updateUserProfile";
import ChangeUserPassword from "./components/changeUserProfile";

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
};

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/user"); // Replace with your actual endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
      toast({
        variant: "default",
        title: "Success!",
        description: "Users loaded successfully.",
      });
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/auth/user/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      await fetchUsers(); // Refetch users after deletion
      toast({
        variant: "default",
        title: "User Deleted",
        description: "The user has been deleted successfully.",
      }); // Success toast after deleting
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      }); // Error toast for delete failure
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div>
        <Loader /> {/* Display loader while loading */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>Error: {error}</p>
        <Button onClick={fetchUsers} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <CreateUserProfile fetchUsers={fetchUsers} />

      <Table>
        <TableCaption>A list of Users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Image</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.name || "No name"}
              </TableCell>
              <TableCell>{user.email || "No email"}</TableCell>
              <TableCell>{user?.role?.name || "Role Not Assigned"}</TableCell>
              <TableCell className="text-right">
                {user.image || "No image"}
              </TableCell>
              <TableCell className="flex text-center items-center justify-center ">
                <div className="flex">
                  <UpdateUserProfile
                    user={{
                      id: user.id,
                      name: user.name || "",
                      email: user.email,
                    }}
                    fetchUsers={fetchUsers}
                  />
                  <Button
                    onClick={() => deleteUser(user.id)}
                    variant={"outline"}
                    className=" ml-4 border border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </Button>
                  <div className="ml-4">
                    <ChangeUserPassword
                      user={{
                        id: user.id,
                        name: user.name || "",
                        email: user.email,
                      }}
                      fetchUsers={fetchUsers}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
