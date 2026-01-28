import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Loader from "@/common/Loader";
import { CategoriesProps, LocationsProps, ProductsProps } from "@/global/types";

interface InventoryFormProps {
  categories: CategoriesProps[];
  products: ProductsProps[];
  locations: LocationsProps[];
  onSubmitSuccess: () => void;
  setOpen: (open: boolean) => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  categories,
  products,
  locations,
  onSubmitSuccess,
  setOpen,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [inventoryData, setInventoryData] = useState<
    { locationId: number; quantity: number }[]
  >([{ locationId: locations[0]?.locationId || 0, quantity: 0 }]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    category: "",
    product: "",
    inventory: "",
  });

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categoryId === selectedCategory)
    : [];

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedInventory = [...inventoryData];
    updatedInventory[index].quantity = quantity;
    setInventoryData(updatedInventory);
    if (formErrors.inventory)
      setFormErrors((prev) => ({ ...prev, inventory: "" }));
  };

  const handleLocationChange = (index: number, locationId: number) => {
    const updatedInventory = [...inventoryData];
    updatedInventory[index].locationId = locationId;
    setInventoryData(updatedInventory);
  };

  const addInventoryRow = () => {
    setInventoryData([...inventoryData, { locationId: 0, quantity: 0 }]);
  };

  const removeInventoryRow = (index: number) => {
    const updatedInventory = inventoryData.filter((_, i) => i !== index);
    setInventoryData(updatedInventory);
  };

  const validateForm = () => {
    const errors = {
      category: "",
      product: "",
      inventory: "",
    };
    if (!selectedCategory) errors.category = "Please select a category.";
    if (!selectedProduct) errors.product = "Please select a product.";
    if (inventoryData.some((item) => !item.locationId || item.quantity < 0)) {
      errors.inventory = "Ensure a location is selected and Quantity.";
    }

    setFormErrors(errors);
    return !Object.values(errors).some((err) => err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct,
          inventory: inventoryData,
        }),
      });
      if (response.ok) {
        toast({
          variant: "default",
          title: "Success!",
          description: "Inventory successfully created.",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
        onSubmitSuccess();
        setOpen(false);
      } else {
        // Extract and handle error from response
        const errorData = await response.json();

        // Show error toast
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Failed to create inventory. Please try again later." +
            errorData.message,
          // description: errorData.message || "Failed to create inventory. Please try again later.",
        });
        setFormErrors((prev) => ({
          ...prev,
          inventory: "Failed to create inventory. Please try again.",
        }));
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Product already exists!" + err,
      });
      setFormErrors((prev) => ({
        ...prev,
        product: `Product already exists!`,
      }));
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
      className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md max-w-lg w-full mx-auto"
    >
      <h2 className="text-2xl font-semibold dark:text-white">
        Manage Inventory
      </h2>

      {/* Category Selection */}
      <div>
        <Label htmlFor="category" className="mb-2 dark:text-gray-300">
          Category
        </Label>
        <Select
          onValueChange={(value) => {
            setSelectedCategory(Number(value));
            if (formErrors.category)
              setFormErrors((prev) => ({ ...prev, category: "" }));
          }}
          disabled={categories?.length === 0}
        >
          <SelectTrigger
            className={`w-full ${
              formErrors.category ? "border-red-500" : ""
            } text-black dark:text-white`}
          >
            <span>
              {categories?.length === 0
                ? "No categories available"
                : selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name
                : "Select a category"}
            </span>
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.category && (
          <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
        )}
      </div>

      {/* Product Selection */}
      <div>
        <Label htmlFor="product" className="mb-2 dark:text-gray-300">
          Product
        </Label>
        <Select
          onValueChange={(value) => {
            setSelectedProduct(Number(value));
            if (formErrors.product)
              setFormErrors((prev) => ({ ...prev, product: "" }));
          }}
          disabled={filteredProducts.length === 0}
        >
          <SelectTrigger
            className={`w-full ${
              formErrors.product ? "border-red-500" : ""
            } text-black dark:text-white`}
          >
            <span>
              {filteredProducts.length === 0
                ? "No products available"
                : selectedProduct
                ? filteredProducts.find((p) => p.productId === selectedProduct)
                    ?.name
                : "Select a product"}
            </span>
          </SelectTrigger>
          <SelectContent>
            {filteredProducts.map((product) => (
              <SelectItem
                key={product.productId}
                value={product.productId.toString()}
              >
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.product && (
          <p className="text-red-500 text-sm mt-1">{formErrors.product}</p>
        )}
      </div>

      {/* Inventory Rows */}
      <div className="max-h-60 overflow-y-auto space-y-4">
        {inventoryData.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 items-center ${
              formErrors.inventory ? "border-red-500" : ""
            }`}
          >
            {/* Location */}
            <div>
              <Label
                htmlFor={`location-${index}`}
                className="mb-2 dark:text-gray-300"
              >
                Location
              </Label>
              <Select
                onValueChange={(value) =>
                  handleLocationChange(index, Number(value))
                }
                value={
                  item.locationId === null
                    ? "placeholder"
                    : item.locationId.toString()
                }
              >
                <SelectTrigger className="w-full text-black dark:text-white">
                  <span>
                    {locations.find((l) => l.locationId === item.locationId)
                      ?.locationName || "Select a location"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>
                    Select category
                  </SelectItem>
                  {locations.map((location) => (
                    <SelectItem
                      key={location.locationId}
                      value={location.locationId.toString()}
                    >
                      {location.locationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <Label
                htmlFor={`quantity-${index}`}
                className="mb-2 dark:text-gray-300"
              >
                Quantity
              </Label>
              <Input
                type="number"
                min="0"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(index, Number(e.target.value))
                }
                id={`quantity-${index}`}
                className={`w-full ${
                  formErrors.inventory ? "border-red-500" : ""
                }`}
              />
            </div>

            {/* Remove Row */}
            <div className="flex items-center justify-center mt-6">
              {/* <Label
                htmlFor={`quantity-${index}`}
                className="mb-2 dark:text-gray-300"
              >
                Remove
              </Label> */}
              <Button
                variant="outline"
                className="w-full text-red-500"
                onClick={() => removeInventoryRow(index)}
              >
                <Trash className="w-8 h-8" />
              </Button>
            </div>
          </div>
        ))}
        {formErrors.inventory && (
          <p className="text-red-500 text-sm mt-1">{formErrors.inventory}</p>
        )}
      </div>

      {/* Add Row Button */}
      <Button
        variant="outline"
        onClick={addInventoryRow}
        className="flex items-center space-x-2"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Add Location</span>
      </Button>

      {/* Submit Button */}
      <Button type="submit" variant="outline" className="w-full">
        {loading ? "Saving..." : "Save Inventory"}
      </Button>
    </form>
  );
};

export default InventoryForm;
