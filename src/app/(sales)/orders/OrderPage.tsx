//endefelekut yemiseraw new kezi betach yalew
"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Loader from "@/common/Loader";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

const OrderPage = ({ initialInventories, initialCategories }) => {
  // const [customerName, setCustomerName] = useState("");
  // const [customerContact, setCustomerContact] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customers, setCustomers] = useState([]);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    email: "",
    address: ""
  });
  const [lineItems, setLineItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  const [inventories, setInventories] = useState(initialInventories);
  const [categories, setCategories] = useState(initialCategories);

  const uniqueLocations = [
    ...new Map(inventories.map((inv) => [inv.location.locationId, inv.location])).values(),
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customer");
      const data = await response.json();
      setCustomers(data.customers);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetccch customers',
      });
    }
  };

  const handleAddCustomer = async () => {
    try {
      const response = await fetch(`/api/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) throw new Error('Failed to create customer');

      const createdCustomer = await response.json();
      setCustomers([...customers, createdCustomer]);
      setSelectedCustomerId(createdCustomer.customerId);
      setShowAddCustomerModal(false);
      setNewCustomer({ name: "", contact: "", email: "", address: "" });
      fetchCustomers();
      toast({
        title: 'Success!',
        description: 'Customer created successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };


  const updateLineItem = (index, key, value) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index][key] = value;

    if (key === "locationId") {
      // Filter categories and products based on selected location
      const filteredInventory = inventories.filter(
        (item) => item.location.locationId === parseInt(value)
      );
      const filteredCategories = [
        ...new Set(
          filteredInventory.map((item) => item.product.categoryId)
        ),
      ]
        .map((categoryId) =>
          initialCategories.find((cat) => cat.id === categoryId)
        )
        .filter(Boolean);

      const filteredProducts = filteredInventory.map((item) => ({
        ...item.product,
        inventoryQuantity: item.quantity,
      }));

      updatedLineItems[index].categories = filteredCategories;
      updatedLineItems[index].products = filteredProducts;
      updatedLineItems[index].categoryId = "";
      updatedLineItems[index].productId = "";
    }

    if (key === "categoryId") {
      updatedLineItems[index].productId = ""; // Reset product when category changes
    } else if (key === "productId") {
      const selectedProduct = updatedLineItems[index].products?.find(
        (product) => product.productId === parseInt(value)
      );
      updatedLineItems[index].manualPrice = selectedProduct ? selectedProduct.price : 0;
      updatedLineItems[index].totalPrice = updatedLineItems[index].quantity * updatedLineItems[index].manualPrice;
    } else if (key === "quantity") {
      updatedLineItems[index].totalPrice = updatedLineItems[index].quantity * updatedLineItems[index].manualPrice;
    } else if (key === "manualPrice") {
      updatedLineItems[index].totalPrice = updatedLineItems[index].quantity * value;
    }

    setLineItems(updatedLineItems);
    const total = updatedLineItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  };

  const validateForm = () => {
    const newErrors = {};
    // if (!customerName) newErrors.customerName = "Customer name is required";
    // if (!customerContact) newErrors.customerContact = "Customer contact is required";
    if (lineItems.length === 0) newErrors.lineItems = "At least one product must be added to the order";

    lineItems.forEach((item, index) => {
      if (!item.locationId) newErrors[`locationId_${index}`] = "Location is required for line item";
      if (!item.categoryId) newErrors[`categoryId_${index}`] = "Category is required for line item";
      if (!item.productId) newErrors[`productId_${index}`] = "Product is required for line item";
      if (item.quantity <= 0) newErrors[`quantity_${index}`] = "Quantity must be greater than zero";
      if (item.manualPrice <= 0) newErrors[`manualPrice_${index}`] = "Price must be greater than zero";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { locationId: "", categoryId: "", productId: "", quantity: 1, manualPrice: 0, totalPrice: 0, categories: [], products: [] },
    ]);
  };

  const removeLineItem = (index) => {
    const updatedLineItems = lineItems.filter((_, i) => i !== index);
    setLineItems(updatedLineItems);
    const total = updatedLineItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
    setApiMessage(""); // Clear previous API messages
  
    const orderData = {
      // customerName,
      // customerContact,
      customerId: selectedCustomerId ? parseInt(selectedCustomerId) : null,
      paymentStatus,
      dueDate: new Date().toISOString(),
      orderDate: new Date().toISOString(),
      totalAmount,
      salesOrderLineItems: lineItems.map((item) => ({
        locationId: item.locationId,
        categoryId: item.categoryId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.manualPrice,
        totalPrice: item.totalPrice,
      })),
    };
  
    try {
      setLoading(true);
      const response = await fetch('/api/sale/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
    
        // Show error toast
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorData.message || 'An error occurred while processing the request.',
        });
    
        setApiMessage(errorData.message || 'An error occurred.');
        return;
      }
    
      const result = await response.json();
      
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl; 
      }
      // Show success toast
      toast({
        variant: 'default',
        title: 'Success!',
        description: 'Order successfully created!',
      });
    
      setApiMessage('Order successfully created!');
      resetForm(); // Reset form after successful operation
    } catch (error) {
      // Show network error toast
      toast({
        variant: 'destructive',
        title: 'Network Error',
        description: 'Failed to submit the order. Please check your connection and try again.',
      });
    
      setApiMessage('Failed to submit the order. Please try again.');
    } finally {
      setLoading(false);
    }
    
  };
  

  const resetForm = () => {
    // setCustomerName("");
    // setCustomerContact("");
    setPaymentStatus("Unpaid");
    setLineItems([]);
    setTotalAmount(0);
  };

  if (loading) {
    return (
    <div>
      <Loader/>
    </div>);
  }


  return (
    <div className="max-w-4xl mx-auto p-6 bg-background shadow-lg rounded-lg">
  <h1 className="text-2xl font-bold text-center mb-6 text-primary">Create New Sale</h1>

  {/* Customer Details */}
  {/* <div className="mb-6">
    <Label htmlFor="customerName" className="text-primary">Customer Name</Label>
    <Input
      id="customerName"
      value={customerName}
      onChange={(e) => setCustomerName(e.target.value)}
      placeholder="Enter customer name"
      className="mt-2 px-4 py-2 border border-input rounded-md w-full bg-input text-foreground"
    />
    {errors.customerName && <p className="text-red-600 text-sm">{errors.customerName}</p>}
  </div>
  
  <div className="mb-6">
    <Label htmlFor="customerContact" className="text-primary">Customer Contact</Label>
    <Input
      id="customerContact"
      value={customerContact}
      onChange={(e) => setCustomerContact(e.target.value)}
      placeholder="Enter customer contact"
      className="mt-2 px-4 py-2 border border-input rounded-md w-full bg-input text-foreground"
    />
    {errors.customerContact && <p className="text-red-600 text-sm">{errors.customerContact}</p>}
  </div> */}
{/* Customer Select */}
<div className="mb-6">
  <Label className="text-primary">Customer</Label>
  <div className="flex gap-2">
  <Select
  value={selectedCustomerId}
  onValueChange={setSelectedCustomerId}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select customer" />
  </SelectTrigger>
  <SelectContent>
    {/* Use a specific value for "None" */}
    <SelectItem value="none">None (Anonymous Sale)</SelectItem>
    {customers.map((customer) => (
      <SelectItem 
        key={customer.customerId} 
        value={customer.customerId}
      >
        {customer.name} ({customer.contact})
      </SelectItem>
    ))}
  </SelectContent>
</Select>

<Dialog 
  open={showAddCustomerModal} 
  onOpenChange={setShowAddCustomerModal}
>
  <DialogTrigger asChild>
    <Button variant="outline" size="icon">
      <PlusCircle className="h-4 w-4" />
    </Button>
  </DialogTrigger>
  <DialogContent className="max-h-[80vh] overflow-y-auto p-6">
    <DialogHeader>
      <DialogTitle>Add New Customer</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <Input
        placeholder="Name *"
        value={newCustomer.name}
        onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
        className="w-full"
      />
      <Input
        placeholder="Contact *"
        value={newCustomer.contact}
        onChange={(e) => setNewCustomer({...newCustomer, contact: e.target.value})}
        className="w-full"
      />
      <Input
        placeholder="Email"
        value={newCustomer.email}
        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
        className="w-full"
      />
      <Input
        placeholder="Address"
        value={newCustomer.address}
        onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
        className="w-full"
      />
      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={() => setShowAddCustomerModal(false)}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleAddCustomer}
          disabled={!newCustomer.name || !newCustomer.contact}
          className="w-full sm:w-auto bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white focus:ring-2 focus:ring-green-500 rounded-lg py-2 px-4 transition-all"
       
        >
          Save Customer
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

  </div>
</div>

  {/* Product Table */}
  <Table className="border-collapse w-full text-foreground">
    <TableHeader>
      <TableRow>
        <TableHead className="text-left p-3">Location</TableHead>
        <TableHead className="text-left p-3">Category</TableHead>
        <TableHead className="text-left p-3">Product</TableHead>
        <TableHead className="text-left p-3">Quantity</TableHead>
        <TableHead className="text-left p-3">Unit Price</TableHead>
        <TableHead className="text-left p-3">Total Price</TableHead>
        <TableHead className="text-left p-3">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {lineItems.map((item, index) => (
        <TableRow key={index}>
          {/* Location */}
          <TableCell>
            <Select
              onValueChange={(value) => updateLineItem(index, "locationId", value)}
              defaultValue={item.locationId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location.locationId} value={location.locationId.toString()}>
                    {location.locationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[`locationId_${index}`] && <p className="text-red-600 text-sm">{errors[`locationId_${index}`]}</p>}
          </TableCell>

          {/* Category */}
          <TableCell>
            <Select
              onValueChange={(value) => updateLineItem(index, "categoryId", value)}
              defaultValue={item.categoryId}
              disabled={!item.categories.length}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {item.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[`categoryId_${index}`] && <p className="text-red-600 text-sm">{errors[`categoryId_${index}`]}</p>}
          </TableCell>

          {/* Product */}
          <TableCell>
            <Select
              onValueChange={(value) => updateLineItem(index, "productId", value)}
              defaultValue={item.productId}
              disabled={!item.products.length}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {item.products.map((product) => (
                  <SelectItem key={product.productId} value={product.productId.toString()}>
                    {product.name} - {product.inventoryQuantity} in stock
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[`productId_${index}`] && <p className="text-red-600 text-sm">{errors[`productId_${index}`]}</p>}
          </TableCell>

          {/* Quantity */}
          <TableCell>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => updateLineItem(index, "quantity", parseInt(e.target.value))}
              className="w-full"
            />
            {errors[`quantity_${index}`] && <p className="text-red-600 text-sm">{errors[`quantity_${index}`]}</p>}
          </TableCell>

          {/* Unit Price */}
          <TableCell>
            <Input
              type="number"
              value={item.manualPrice}
              onChange={(e) => updateLineItem(index, "manualPrice", parseFloat(e.target.value))}
              className="w-full"
            />
            {errors[`manualPrice_${index}`] && <p className="text-red-600 text-sm">{errors[`manualPrice_${index}`]}</p>}
          </TableCell>

          {/* Total Price */}
          <TableCell>
            <Input
              type="number"
              value={item.totalPrice}
              disabled
              className="w-full"
            />
          </TableCell>

          {/* Actions */}
          <TableCell>
            <Button
                type="button"
                variant="outline"
                onClick={() => removeLineItem(index)}
                className="w-full border border-red-500 text-red-500 hover:bg-red-500 focus:ring-2 focus:ring-red-500"
              >
              Remove
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

{/* Total Amount */}
<div className="mt-6 flex justify-end items-center space-x-4">
  <h3 className="text-xl font-semibold text-primary">Total Amount:</h3>
  <p className="text-lg text-primary">{totalAmount.toFixed(2)} ብር</p>
</div>
 {/* Add New Line Item Button */}
<div className="mt-6 text-center">
  <Button 
    type="button" 
    onClick={addLineItem} 
    className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-2 focus:ring-blue-500 rounded-lg py-2 px-4 transition-all"
  >
    Add New Line Item
  </Button>
</div>

{/* Submit Button */}
<div className="mt-6 text-center">
  <Button 
    onClick={handleSubmit} 
    disabled={loading} 
    className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white focus:ring-2 focus:ring-green-500 rounded-lg py-2 px-4 transition-all"
  >
    {loading ? "Submitting..." : "Submit Order"}
  </Button>
  {apiMessage && <p className="text-sm text-center mt-4">{apiMessage}</p>}
</div>

</div>

  );
};

export default OrderPage;

