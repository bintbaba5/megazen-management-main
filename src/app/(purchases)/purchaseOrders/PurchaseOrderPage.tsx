"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Loader from "@/common/Loader";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

const OrderPage = ({ initialInventories, initialCategories }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [lineItems, setLineItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [payedAmount, setPayedAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  const [inventories, setInventories] = useState(initialInventories);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);
  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/supplier');
      const data = await response.json();
      setSuppliers(data.suppliers);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch suppliers' });
    }
  };

  const handleAddSupplier = async () => {
    try {
      const response = await fetch('/api/supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier)
      });

      if (!response.ok) throw new Error('Failed to create supplier');
      
      const createdSupplier = await response.json();
      setSuppliers([...suppliers, createdSupplier]);
      setSelectedSupplierId(createdSupplier.supplierId);
      setShowAddSupplierModal(false);
      setNewSupplier({ name: "", phone: "", email: "", address: "" });
      fetchSuppliers();
      toast({ title: 'Success!', description: 'Supplier created successfully' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };


  useEffect(() => {
    if (!selectedLocation) return;

    const filteredInventory = inventories.filter(
      (item) => item.locationId === parseInt(selectedLocation)
    );
    const filteredCategories = [
      ...new Set(filteredInventory.map((item) => item.product.categoryId)),
    ]
      .map((categoryId) =>
        initialCategories.find((cat) => cat.id === categoryId)
      )
      .filter(Boolean);

    const filteredProducts = filteredInventory.map((item) => ({
      ...item.product,
      inventoryQuantity: item.quantity,
    }));

    setCategories(filteredCategories);
    setProducts(filteredProducts);
  }, [selectedLocation, inventories, initialCategories]);

  const uniqueLocations = [
    ...new Map(
      inventories.map((inv) => [inv.location.locationId, inv.location])
    ).values(),
  ];

  const productMap = {};
  products.forEach((product) => {
    if (!productMap[product.categoryId]) {
      productMap[product.categoryId] = [];
    }
    productMap[product.categoryId].push(product);
  });

  useEffect(() => {
    if (paymentStatus === "Paid") {
      setPayedAmount(totalAmount);
    } else if (paymentStatus === "Unpaid") {
      setPayedAmount(0);
    }
  }, [paymentStatus, totalAmount]);

  const validateForm = () => {
    const newErrors = {};
    // if (!customerName) newErrors.customerName = "Customer name is required";
    // if (!customerContact)
    //   newErrors.customerContact = "Customer contact is required";
    if (!selectedSupplierId) newErrors.supplier = "Supplier selection is required";
    if (lineItems.length === 0)
      newErrors.lineItems = "At least one product must be added to the order";

    lineItems.forEach((item, index) => {
      if (!item.categoryId)
        newErrors[`categoryId_${index}`] = "Category is required for line item";
      if (!item.productId)
        newErrors[`productId_${index}`] = "Product is required for line item";
      if (item.quantity <= 0)
        newErrors[`quantity_${index}`] = "Quantity must be greater than zero";
      if (item.manualPrice <= 0)
        newErrors[`manualPrice_${index}`] = "Price must be greater than zero";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        productId: "",
        categoryId: "",
        quantity: 1,
        manualPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const removeLineItem = (index) => {
    const updatedLineItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedLineItems);
    const total = updatedLineItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    setTotalAmount(total);
  };

  const updateLineItem = (index, key, value) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index][key] = value;

    if (key === "categoryId") {
      updatedLineItems[index].productId = "";
    } else if (key === "productId") {
      const selectedProduct = productMap[
        updatedLineItems[index].categoryId
      ]?.find((product) => product.productId === parseInt(value));
      updatedLineItems[index].manualPrice = selectedProduct
        ? selectedProduct.price
        : 0;
      updatedLineItems[index].totalPrice =
        updatedLineItems[index].quantity * updatedLineItems[index].manualPrice;
    } else if (key === "quantity" || key === "manualPrice") {
      updatedLineItems[index].totalPrice =
        updatedLineItems[index].quantity * updatedLineItems[index].manualPrice;
    }

    setLineItems(updatedLineItems);
    const total = updatedLineItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    setTotalAmount(total);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const saleData = {
      // supplierName: customerName,
      // supplierPhone: customerContact,
      supplierId: selectedSupplierId ? parseInt(selectedSupplierId) : null,
      totalAmount,
      paymentStatus,
      paidAmount: payedAmount,
      locationId: selectedLocation,
      orderDate: new Date().toISOString(),
      purchaseOrderLineItems: lineItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.manualPrice,
        totalPrice: item.totalPrice,
      })),
    };

    setLoading(true);
    setApiMessage("");

    try {
      setLoading(true);
      const response = await fetch(`/api/purchase/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      const data = await response.json();
      if (response.ok) {
        // Show success toast
        toast({
          variant: "default",
          title: "Success!",
          description: "Purchase order successfully created!",
        });

        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        }
        // Update state variables
        setApiMessage("Purchase order successfully created!");
        // setCustomerName("");
        // setCustomerContact("");
        setLineItems([]);
        setTotalAmount(0);
        setPaymentStatus("Unpaid");
        setPayedAmount(0);
      } else {
        // Show error toast
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to create purchase order.",
        });

        setApiMessage(data.error || "Failed to create purchase order.");
      }
    } catch (error) {
      // Show error toast for unexpected errors
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while creating the purchase order.",
      });

      setApiMessage("An error occurred while creating the purchase order.");
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
    <div className="max-w-4xl mx-auto p-6 bg-background shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-primary">
        New Purchase (ግዢ)
      </h1>

      {/* Customer Details */}
      {/* <div className="mb-6">
        <Label htmlFor="customerName" className="text-primary">
          Supplyer Name
        </Label>
        <Input
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter Supplyer name"
          className="mt-2 px-4 py-2 border border-input rounded-md w-full bg-input text-foreground"
        />
        {errors.customerName && (
          <p className="text-red-600 text-sm">{errors.customerName}</p>
        )}
      </div>

      <div className="mb-6">
        <Label htmlFor="customerContact" className="text-primary">
          Supplyer Contact
        </Label>
        <Input
          id="customerContact"
          value={customerContact}
          onChange={(e) => setCustomerContact(e.target.value)}
          placeholder="Enter Supplyer contact"
          className="mt-2 px-4 py-2 border border-input rounded-md w-full bg-input text-foreground"
        />
        {errors.customerContact && (
          <p className="text-red-600 text-sm">{errors.customerContact}</p>
        )}
      </div> */}
    <div className="mb-6">
        <Label className="text-primary">Supplier</Label>
        <div className="flex gap-2">
          <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="none">Supplier X</SelectItem>
   
              {suppliers.map(supplier => (
                <SelectItem key={supplier.supplierId} value={supplier.supplierId}>
                  {supplier.name} ({supplier.phone})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={showAddSupplierModal} onOpenChange={setShowAddSupplierModal}>
  <DialogTrigger asChild>
    <Button variant="outline" size="icon">
      <PlusCircle className="h-4 w-4" />
    </Button>
  </DialogTrigger>
  <DialogContent className="max-h-[80vh] overflow-y-auto p-6">
    <DialogHeader>
      <DialogTitle>Add New Supplier</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <Input
        placeholder="Name"
        value={newSupplier.name}
        onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
        className="w-full"
      />
      <Input
        placeholder="Phone"
        value={newSupplier.phone}
        onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})}
        className="w-full"
      />
      <Input
        placeholder="Email"
        value={newSupplier.email}
        onChange={e => setNewSupplier({...newSupplier, email: e.target.value})}
        className="w-full"
      />
      <Input
        placeholder="Address"
        value={newSupplier.address}
        onChange={e => setNewSupplier({...newSupplier, address: e.target.value})}
        className="w-full"
      />
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setShowAddSupplierModal(false)}>
          Cancel
        </Button>
        <Button onClick={handleAddSupplier} 
        className="w-full sm:w-auto bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white focus:ring-2 focus:ring-green-500 rounded-lg py-2 px-4 transition-all"
        >
          Save Supplier
        </Button>
      </div>
    </div>
  </DialogContent>
          </Dialog>

        </div>
        {errors.supplier && <p className="text-red-600 text-sm">{errors.supplier}</p>}
      </div>

      <div className="mb-6">
        <Label htmlFor="customerContact" className="text-primary">
          Select warehouse
        </Label>

        <Select
          onValueChange={(value) => setSelectedLocation(value)}
          defaultValue={selectedLocation}
        >
          <SelectTrigger className="w-full">
            <SelectValue className="text-white" placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Warehouse</SelectLabel>
              {uniqueLocations.map((location) => (
                <SelectItem
                  key={location.locationId}
                  value={location.locationId.toString()}
                >
                  {location.locationName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Line Items */}
      <h2 className="text-lg font-semibold mb-4 text-primary">
        Order Line Items
      </h2>
      <Table className="border-collapse w-full text-foreground">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left p-3">Category</TableHead>
            <TableHead className="text-left p-3">Product</TableHead>
            <TableHead className="text-left p-3">Quantity</TableHead>
            <TableHead className="text-left p-3">Manual Price</TableHead>
            <TableHead className="text-left p-3">Total Price</TableHead>
            <TableHead className="text-left p-3">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lineItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Select
                  onValueChange={(value) =>
                    updateLineItem(index, "categoryId", value)
                  }
                  defaultValue={item.categoryId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`categoryId_${index}`] && (
                  <p className="text-red-600 text-sm">
                    {errors[`categoryId_${index}`]}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <Select
                  onValueChange={(value) =>
                    updateLineItem(index, "productId", value)
                  }
                  defaultValue={item.productId}
                  disabled={!item.categoryId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products
                      .filter(
                        (prod) =>
                          prod.categoryId?.toString() === item.categoryId
                      )
                      .map((product) => (
                        <SelectItem
                          key={product.productId}
                          value={product.productId.toString()}
                        >
                          {product.name} (Stock: {product.inventoryQuantity})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors[`productId_${index}`] && (
                  <p className="text-red-600 text-sm">
                    {errors[`productId_${index}`]}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateLineItem(index, "quantity", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-input text-foreground"
                />
                {errors[`quantity_${index}`] && (
                  <p className="text-red-600 text-sm">
                    {errors[`quantity_${index}`]}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.manualPrice}
                  onChange={(e) =>
                    updateLineItem(
                      index,
                      "manualPrice",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-input text-foreground"
                />
                {errors[`manualPrice_${index}`] && (
                  <p className="text-red-600 text-sm">
                    {errors[`manualPrice_${index}`]}
                  </p>
                )}
              </TableCell>
              <TableCell>{item.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => removeLineItem(index)}
                  className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Item Button */}
      <div className="my-4 text-center">
        <Button
          variant="outline"
          onClick={addLineItem}
          className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
        >
          Add Product
        </Button>
      </div>

      {/* Invoice Total */}
      {/* Total Amount */}
      <div className="text-right font-bold text-lg mt-6">
        Total Amount: {totalAmount.toFixed(2)} ብር
      </div>

      {/* Payed Amount */}
      <div className="mb-6">
        <Label htmlFor="paymentStatus" className="text-primary">
          Payment Status
        </Label>
        <Select
          onValueChange={(value) => setPaymentStatus(value)}
          defaultValue={paymentStatus}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Partial">Partial</SelectItem>
            <SelectItem value="Unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>

        <Label htmlFor="payedAmount" className="mt-4 text-primary">
          Payed Amount
        </Label>
        <Input
          id="payedAmount"
          type="number"
          value={payedAmount}
          onChange={(e) => setPayedAmount(parseFloat(e.target.value) || 0)}
          disabled={paymentStatus !== "Partial"}
          className="mt-2 px-4 py-2 border border-input rounded-md w-full bg-input text-foreground"
        />
      </div>

      <div className="mt-6 text-center">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white focus:ring-2 focus:ring-green-500 rounded-lg py-2 px-4 transition-all"
        >
          {loading ? "Submitting..." : "Submit Order"}
        </Button>
        {apiMessage && (
          <p className="mt-4 text-center text-green-600">{apiMessage}</p>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
