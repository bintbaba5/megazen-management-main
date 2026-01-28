type PurchaseOrderLineItem = {
  id: number;
  purchaseOrderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: Product; // Assuming `Product` type is defined elsewhere
};

type PurchaseOrder = {
  purchaseId: number;
  supplierName: string;
  supplierPhone: string;
  locationId: number;
  orderDate: string; // Use string for Date in JSON format
  status: 'Pending' | 'Received' | 'Cancelled';
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'Unpaid' | 'Paid' | 'Partial';
  createdAt: string; // Use string for Date in JSON format
  updatedAt: string; // Use string for Date in JSON format
  PurchaseOrderLineItems: PurchaseOrderLineItem[];
  location: Location; // Assuming `Location` type is defined elsewhere
};
