// User type
export type UserProps = {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  notificationToken?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  accounts?: AccountProps[];
  sessions?: SessionProps[];
  Authenticator?: AuthenticatorProps[];
  role?: RoleProps;
  notifications?: NotificationProps[];
  audits?: AuditProps[];
};

// Account type
export type AccountProps = {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user: UserProps;
};

// Session type
export type SessionProps = {
  sessionToken: string;
  userId: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user: UserProps;
};

// VerificationToken type
export type VerificationTokenProps = {
  identifier: string;
  token: string;
  expires: Date;
};

// Authenticator type
export type AuthenticatorProps = {
  credentialID: string;
  userId: string;
  providerAccountId: string;
  credentialPublicKey: string;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports?: string;

  // Relations
  user: UserProps;
};

// Notification type
export type NotificationProps = {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user: UserProps;
};

// Role type
export type RoleProps = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  users?: UserProps[];
  permissions?: PermissionProps[];
};

// Permission type
export type PermissionProps = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  roles?: RoleProps[];
};

// Categories type
export type CategoriesProps = {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  products?: ProductsProps[];
};

// Products type
export type ProductsProps = {
  productId: number;
  name: string;
  description?: string;
  categoryId?: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  category?: CategoriesProps;
  inventory?: InventoryProps[];
  stockTransfers?: StockTransfersProps[];
  salesOrderLineItems?: SalesOrderLineItemsProps[];
  purchaseOrderLineItems?: PurchaseOrderLineItemsProps[];
};

export type CustomersProps = {
  customerId: number;
  name: string;
  contact?: string;
  address?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SuppliersProps = {
  supplierId: number;
  name: string;
  contact?: string;
  address?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
};
// Inventory type
export type InventoryProps = {
  inventoryId: number;
  productId: number;
  locationId: number;
  quantity: number;
  lowStockLevel?: number;
  isLowStock: boolean;
  lastUpdated: Date;

  // Relations
  product: ProductsProps;
  location: LocationsProps;
  audits?: AuditProps[];
  movements?: StockMovementsProps[];
  sourceTransfers?: StockTransfersProps[];
  destinationTransfers?: StockTransfersProps[];
};

// StockMovements type
export type StockMovementsProps = {
  movementId: number;
  inventoryId: number;
  type: string;
  quantity: number;
  timestamp: Date;
  auditId?: number;

  // Relations
  inventory: InventoryProps;
  audit?: AuditProps;
};

// StockTransfers type
export type StockTransfersProps = {
  transferId: number;
  sourceInventoryId: number;
  destinationInventoryId: number;
  productId: number;
  quantity: number;
  timestamp: Date;
  auditId?: number;

  // Relations
  sourceInventory: InventoryProps;
  destinationInventory: InventoryProps;
  product: ProductsProps;
  audit?: AuditProps;
};

// Audits type
export type AuditProps = {
  auditId: number;
  userId: string;
  action: string;
  inventoryId?: number;
  oldQuantity?: number;
  newQuantity: number;
  timestamp: string;

  // Relations
  user: UserProps;
  inventory?: InventoryProps;
  movements?: StockMovementsProps[];
  transfers?: StockTransfersProps[];
};

// Locations type
export type LocationsProps = {
  locationId: number;
  locationName: string;
  locationAddress: string;

  // Relations
  inventory?: InventoryProps[];
  salesOrderLineItems?: SalesOrderLineItemsProps[];
  purchases?: PurchasesProps[];
};

// Sales type
export type SalesProps = {
  saleId: number;
  customerId: string;
  customerContact?: string;
  orderDate: Date;
  dueDate: Date;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  payedAmount: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  SalesOrderLineItems?: SalesOrderLineItemsProps[];
  customer: CustomersProps;
};

// SalesOrderLineItems type
export type SalesOrderLineItemsProps = {
  id: number;
  salesOrderId: number;
  productId: number;
  locationId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;

  // Relations
  salesOrder: SalesProps;
  product: ProductsProps;
  location: LocationsProps;
};

// Purchases type
export type PurchasesProps = {
  purchaseId: number;
  supplierId: number;
  supplierPhone: string;
  locationId: number;
  orderDate: Date;
  status: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  PurchaseOrderLineItems?: PurchaseOrderLineItemsProps[];
  location: LocationsProps;
  supplier: SuppliersProps;
};

// PurchaseOrderLineItems type
export type PurchaseOrderLineItemsProps = {
  id: number;
  purchaseOrderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;

  // Relations
  purchaseOrder: PurchasesProps;
  product: ProductsProps;
};

export type CreditTransactionProps = {
  id: number;
  customer: CustomersProps;
  supplier: SuppliersProps;
  sale: SalesProps;
  purchase: PurchasesProps;
  type: string;
  amount: number;
  description?: string;
  date: Date;
};

export type creditBalanceProps = {
  id: number;
  balance: number;
  type: string;
  customer: CustomersProps;
  supplier: SuppliersProps;
};
