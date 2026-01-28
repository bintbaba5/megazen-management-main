import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductProps } from "../../generalTypes";
import Loader from "@/common/Loader";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";

type Props = {
  product: ProductProps | undefined;
  inventory: {
    inventoryId: number;
    productId: number;
    locationId: number;
    quantity: number;
    lastUpdated: Date;
  };
  locations: { locationId: number; locationName: string }[];
  onSubmitSuccess: () => void;
  setOpen: (isOpen: boolean) => void;
};

const StockTransferForm = ({
  product,
  locations,
  inventory,
  onSubmitSuccess,
  setOpen,
}: Props) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [sourceLocationId, setSourceLocationId] = useState<number | "">(
    inventory.locationId
  );
  const [destinationLocationId, setDestinationLocationId] = useState<
    number | ""
  >("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (inventory) {
      setSourceLocationId(inventory.locationId);
    }
  }, [inventory]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!sourceLocationId || !destinationLocationId) {
      setError("Both source and destination locations are required.");
      return;
    }

    if (sourceLocationId === destinationLocationId) {
      setError("Source and destination locations cannot be the same.");
      return;
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/stock-transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product?.productId,
          quantity,
          sourceLocationId,
          destinationLocationId,
        }),
      });

      if (response.ok) {
        toast({
          variant: "default",
          title: "Success!",
          description: "Transfer successfully.",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
        onSubmitSuccess();
        setOpen(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to transfer stock.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to transfer stock.",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      }
    } catch (err) {
      setError("An error occurred while transferring stock.");
      toast({
        variant: "destructive",
        title: "Error",
        description: `An error occurred while transferring stock`,
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 rounded-lg shadow-md bg-white dark:bg-gray-900"
    >
      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
        Transfer Stock for {product?.name}
      </h3>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Quantity
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className={`mt-1 block w-full border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : ""
          }`}
          min={1}
          required
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Source Location
        </label>
        <Select
          onValueChange={(e) => setSourceLocationId(e === "" ? "" : Number(e))}
          value={String(sourceLocationId)}
          disabled={inventory.locationId ? true : false}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Warehouse</SelectLabel>
              {locations.map((loc) => (
                <SelectItem key={loc.locationId} value={String(loc.locationId)}>
                  {loc.locationName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Destination Location
        </label>
        <Select
          onValueChange={(e) =>
            setDestinationLocationId(e === "" ? "" : Number(e))
          }
          value={String(destinationLocationId)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Warehouse</SelectLabel>
              {locations
                .filter((location) => location.locationId != sourceLocationId)
                .map((loc) => (
                  <SelectItem
                    key={loc.locationId}
                    value={String(loc.locationId)}
                  >
                    {loc.locationName}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <select
          value={destinationLocationId}
          onChange={(e) => setDestinationLocationId(Number(e.target.value))}
          className={`mt-1 block w-full border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : ""
          }`}
          required
        >
          <option value="" disabled>
            Select Destination Location
          </option>
          {locations.map((loc) => (
            <option key={loc.locationId} value={loc.locationId}>
              {loc.locationName}
            </option>
          ))}
        </select> */}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          className="border-gray-400 text-gray-600 hover:border-gray-600 dark:border-gray-500 dark:text-gray-300 dark:hover:border-gray-300"
        >
          Cancel
        </Button>
        <Button
          variant={"outline"}
          type="submit"
          className="border border-green-500 text-green-500 px-5 py-3 rounded-md shadow-sm hover:bg-green-500 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-white focus:outline-none transition disabled:border-gray-500 disabled:text-gray-500 disabled:hover:bg-transparent"
        >
          Transfer
        </Button>
      </div>
    </form>
  );
};

export default StockTransferForm;
