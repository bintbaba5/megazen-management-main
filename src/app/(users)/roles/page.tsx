"use client";
// import { prisma } from "@/prisma";
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
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/Modal";
import Loader from "@/common/Loader";
import { toast } from "@/hooks/use-toast";

type Role = {
  id: string;
  name: string;
  description: string;
};

const Page = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!openModal) {
      onCancelClick();
    }
  }, [openModal]);
  async function fetchRoles() {
    setIsLoading(true); // Set loading to true while fetching
    try {
    const response = await fetch("/api/auth/roles");
    const data = await response.json();
    setRoles(data);
  } catch (error) {
    toast({
      variant: "default",
      title: "Error",
      description: "Failed to fetch roles.",
    });
  } finally {
    setIsLoading(false); // Set loading to false after request
  }
  }

  const handleCreateRole = async () => {
    if (!roleName) return;

    setIsLoading(true); // Set loading to true during the request
    try {
      await fetch("api/auth/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roleName,
          description: roleDescription,
        }),
      });

    setRoleName("");
    setRoleDescription("");
    setOpenModal(false);
    fetchRoles();
    toast({
      variant: "default",
      title: "Success!",
      description: "Role created successfully.",
    });
  } catch (error) {
    toast({
      variant: "default",
      title: "Error",
      description: "Failed to create role.",
    });
  } finally {
    setIsLoading(false); 
  }
  };

  const handleDeleteRole = async (roleId: string) => {
    setIsLoading(true); // Set loading to true during the request
    try {
    await fetch("/api/auth/roles/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: roleId,
      }),
    });
    fetchRoles();
    toast({
      variant: "default",
      title: "Success!",
      description: "Role deleted successfully.",
    });
  } catch (error) {
    toast({
      variant: "default",
      title: "Error",
      description: "Failed to delete role.",
    });
  } finally {
    setIsLoading(false); // Set loading to false after request
  }
  };

  const handleEditRole = async (roleId: string) => {
    setIsLoading(true); // Set loading to true during the request
    try {
    await fetch("/api/auth/roles/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: roleId,
        name: roleName,
        description: roleDescription,
      }),
    });
    fetchRoles();
    setOpenModal(false);
    setRoleName("");
    setRoleDescription("");
    toast({
      variant: "default",
      title: "Success!",
      description: "Role updated successfully.",
    });
  } catch (error) {
    toast({
      variant: "default",
      title: "Error",
      description: "Failed to update role.",
    });
  } finally {
    setIsLoading(false); // Set loading to false after request
  }
  };

  const onUpdateClick = (roleId: string) => {
    setOpenModal(true);
    setSelectedRoleId(roleId);
    setRoleName(roles.find((role) => role.id === roleId)?.name || "");
    setRoleDescription(
      roles.find((role) => role.id === roleId)?.description || ""
    );
  };

  const onCancelClick = () => {
    setOpenModal(false);
    setSelectedRoleId(null);
    setRoleName("");
    setRoleDescription("");
  };

  const onSubmitClick = () => {
    if (selectedRoleId) {
      handleEditRole(selectedRoleId);
    } else {
      handleCreateRole();
    }
  };
  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Roles</h2>
      <div className="flex justify-end">
        <Modal
          title="Create Role"
          open={openModal}
          triggerText="Create Role"
          description="Create a new role"
          setOpen={() => {
            setOpenModal(!openModal);
          }}
          formComponent={
            <>
              <Form>
                <Input
                  label="Role Name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                />
                <Input
                  label="Description"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                />
              </Form>
              <div className="flex justify-between">
                <Button onClick={() => onCancelClick()}>Cancel</Button>
                <Button onClick={onSubmitClick}>
                  {selectedRoleId ? "Update Role" : "Create Role"}
                </Button>
              </div>
            </>
          }
          cancelText="cancel"
          // key={purchaseId}
        />
      </div>
      <Table>
        <TableCaption>A list of Roles.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Role name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length &&
            roles?.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">
                  {role.name || "No name"}
                </TableCell>
                <TableCell>{role.description || "No description"}</TableCell>
                <TableCell className="flex text-center items-center justify-center ">
                  <div className="flex justify-between">
                    <Button
                      onClick={() => onUpdateClick(role.id)}
                      className="ml-4 border border-blue-500 text-blue-500 hover:bg-blue-700 hover:text-white"
                    >
                      Update
                    </Button>

                    <Button
                      onClick={() => handleDeleteRole(role.id)}
                      className="ml-4 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </Button>
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


