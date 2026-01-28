export type ProductProps = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  productId: number;
  description: string | null;
  categoryId: number | null;
  category?: CategoryProps;
};
export type InventoryProps = {
  inventoryId?: number;
  productId: number;
  locationId?: number;
  quantity: number;
  lastUpdated?: Date;
  product?: ProductProps;
  location?: LocationProps;
};

export type LocationProps = {
  locationId: number;
  locationName: string;
  locationAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryProps = {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  products: ProductProps[];
};
