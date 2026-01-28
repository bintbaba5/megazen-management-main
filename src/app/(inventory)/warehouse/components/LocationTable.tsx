"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "@/components/Modal";
import { AlertDialogComponent } from "@/components/AlertDialog";
import { LocationProps } from "../../generalTypes";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Loader from "@/common/Loader";

const LocationTable = () => {
  const [locations, setLocations] = useState<LocationProps[]>([]);
  const [editingLocation, setEditingLocation] = useState<LocationProps | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({
    locationName: "",
    locationAddress: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch locations on mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations");
      const data = await response.json();
      setLocations(data.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationName: newLocation.locationName,
          locationAddress: newLocation.locationAddress,
        }),
      });
      if (response.ok) {
        fetchLocations();
        setNewLocation({ locationName: "", locationAddress: "" });
        toast({
          variant: "default",
          title: "Success!",
          description: "Location Created Successfully.",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error creating location.Error: ${error}`,
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (editingLocation) {
      try {
        setLoading(true);
        const response = await fetch(`/api/locations/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locationName: editingLocation.locationName,
            locationAddress: editingLocation.locationAddress,
            locationId: editingLocation.locationId,
          }),
        });
        if (response.ok) {
          fetchLocations();
          setEditingLocation(null);
          toast({
            variant: "default",
            title: "Success!",
            description: "Location Updated Successfully.",
            action: <ToastAction altText="Close">Close</ToastAction>,
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Error Updating location. Error: ${error}`,
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (locationId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/locations/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId }),
      });
      if (response.ok) {
        fetchLocations();
        toast({
          variant: "default",
          title: "Success!",
          description: "Location Removed Successfully.",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error deleting location. Error: ${error}`,
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Modal
          title="Add New Location"
          description="Enter the name of the new location."
          triggerText="Add Location"
          open={isModalOpen}
          setOpen={setIsModalOpen}
          formComponent={
            <div className="space-y-4 max-h-[75vh] overflow-auto">
              <Input
                placeholder="Location Name"
                value={newLocation.locationName}
                onChange={(e) =>
                  setNewLocation({
                    ...newLocation,
                    locationName: e.target.value,
                  })
                }
                className="p-2 border rounded-md w-full"
              />
              <Input
                placeholder="Location Address"
                value={newLocation.locationAddress}
                onChange={(e) =>
                  setNewLocation({
                    ...newLocation,
                    locationAddress: e.target.value,
                  })
                }
                className="mt-4 p-2 border rounded-md w-full"
              />
              <div className="flex justify-center space-x-4 mt-4 w-0.75rem ">
                <Button
                  onClick={handleCreate}
                  variant="outline"
                  className="w-11/12 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white"
                  disabled={!newLocation.locationName.trim()}
                >
                  Create
                </Button>
              </div>
            </div>
          }
        />
      </div>

      <Table className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-auto">
        <TableCaption className="text-sm text-gray-500 dark:text-gray-400">
          A list of Locations.
        </TableCaption>
        <TableHeader className="bg-gray-50 dark:bg-gray-700">
          <TableRow>
            <TableHead className="text-gray-800 dark:text-gray-100">
              ID
            </TableHead>
            <TableHead className="text-gray-800 dark:text-gray-100">
              Warehouse Name
            </TableHead>
            <TableHead className="text-gray-800 dark:text-gray-100">
              Warehouse Address
            </TableHead>
            <TableHead className="text-center text-gray-800 dark:text-gray-100">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations?.map((location) => (
            <TableRow
              key={location.locationId}
              className="hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <TableCell className="text-gray-700 dark:text-gray-300">
                {location.locationId}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {editingLocation?.locationId === location.locationId ? (
                  <Input
                    className="p-2 border rounded-md w-full"
                    value={editingLocation.locationName}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        locationName: e.target.value,
                      })
                    }
                  />
                ) : (
                  location.locationName
                )}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {editingLocation?.locationId === location.locationId ? (
                  <Input
                    className="p-2 border rounded-md w-full"
                    value={editingLocation.locationAddress}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        locationAddress: e.target.value,
                      })
                    }
                  />
                ) : location.locationAddress ? (
                  location.locationAddress
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell className="text-center flex justify-center space-x-2">
                {editingLocation?.locationId === location.locationId ? (
                  <>
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white"
                      onClick={handleUpdate}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-500 text-gray-600 hover:bg-gray-500 hover:text-white dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-400 dark:hover:text-white"
                      onClick={() => setEditingLocation(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white"
                      onClick={() => setEditingLocation(location)}
                    >
                      Edit
                    </Button>
                    {/* <AlertDialogComponent
                    inventoryId={location.locationId}
                    triggerLabel="Delete"
                    title="Delete Location"
                    description="Are you sure you want to delete this location? This action cannot be undone."
                    cancelLabel="Cancel"
                    actionLabel="Delete"
                    onAction={() => handleDelete(location.locationId)}
                  /> */}
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LocationTable;
