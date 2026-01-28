import {
  Calendar,
  Home,
  Package,
  ShoppingCart,
  FileText,
  PieChart,
  Settings,
  User,
  DollarSign,
  Wallet,
  Store,
  Contact,
} from "lucide-react";

const menuItems = [
  {
    id: 1,
    title: "Dashboard",
    url: "/dashboard",
    color: "blue",
    icon: Home,

    roles: ["admin", "sales", "sales", "fianance"],
  },
  {
    id: 2,
    title: "Products",
    color: "green",
    icon: Package,
    roles: ["admin"],
    subItems: [
      {
        id: 4,
        title: "Categories",
        url: "/categories",
        roles: ["admin"],
        command: "⌘C",
      },
      {
        id: 5,
        title: "Products",
        url: "/products",
        roles: ["admin"],
        command: "⌘P",
      },
    ],
  },
  {
    id: 6,
    title: "Inventory",
    color: "yellow",
    icon: FileText,
    roles: ["admin", "sales"],
    subItems: [
      {
        id: 7,
        title: "Stock Management",
        url: "/inventory",
        roles: ["admin", "sales"],
        command: "⌘I",
      },
      {
        id: 8,
        title: "Warehouse",
        url: "/warehouse",
        roles: ["admin", "sales"],
        command: "⌘W",
      },
      {
        id: 9,
        title: "Stock Transfers",
        url: "/stock-transfers",
        roles: ["admin", "manager"],
        command: "⌘T",
      },
    ],
  },
  {
    id: 10,
    title: "Sales",
    color: "blue",
    icon: ShoppingCart,
    roles: ["sales", "admin", "manager"],
    subItems: [
      {
        id: 11,
        title: "Sales Order",
        url: "/orders",
        roles: ["sales", "admin"],
        command: "⌘O",
      },
      {
        id: 12,
        title: "Orders List",
        url: "/orders-list/salePerson",
        roles: ["sales", "admin"],
      },
      // {
      //   id: 13,
      //   title: "Finance",
      //   url: "/orders-list/finance",
      //   roles: ["admin"],
      //   command: "⌘F",
      // },
    ],
  },
  {
    id: 14,
    title: "Expenses",
    color: "gray",
    icon: DollarSign,
    url: "/expenseList",
    roles: ["sales", "admin", "manager"],
    command: "⌘E",
  },
  {
    id: 15,
    title: "Purchases",
    color: "gray",
    icon: Store,
    roles: ["admin", "manager"],
    subItems: [
      {
        id: 16,
        title: "Purchase Order",
        url: "/purchaseOrders",
        roles: ["admin", "manager"],
      },
      {
        id: 17,
        title: "Purchase List",
        url: "/purchaseLists",
        roles: ["admin", "manager"],
      },
    ],
  },

  {
    id: 18,
    title: "Reports",
    color: "red",
    icon: PieChart,
    roles: ["admin", "sales", "fianance"],
    subItems: [
      {
        id: 19,
        title: "Sales Reports",
        url: "/reports/sales",
        roles: ["admin", "sales"],
        command: "⌘R",
      },
      {
        id: 20,
        title: "Expense Reports",
        url: "/reports/expenses",
        roles: ["admin", "sales"],
      },
      {
        id: 21,
        title: "Inventory Reports",
        url: "/reports/inventory",
        roles: ["admin", "sales", "fianance"],
      },
      {
        id: 22,
        title: "Purchase Reports",
        url: "/reports/purchases",
        roles: ["admin", "sales"],
      },
    ],
  },
  {
    id: 23,
    title: "Clients",
    color: "green",
    icon: Contact,
    roles: ["admin"],
    subItems: [
      {
        id: 29,
        title: "Suppliers",
        url: "/suppliers",
        roles: ["admin", "manager"],
      },
      {
        id: 30,
        title: "Customers",
        url: "/customers",
        roles: ["admin", "manager"],
      },
    ],
  },
  {
    id: 24,
    title: "Users",
    color: "yellow",
    icon: User,
    roles: ["admin"],
    subItems: [
      {
        id: 25,

        title: "Users",
        url: "/users",
        roles: ["admin"],
        command: "⌘U",
      },
      {
        id: 26,
        title: "Roles",
        url: "/roles",
        roles: ["admin"],
        command: "⌘X",
      },
    ],
  },
  {
    id: 27,
    title: "Credit",
    color: "green",
    icon: Wallet,
    roles: ["admin", "manager"],
    subItems: [
      {
        id: 28,
        title: "Credit Transactions",
        url: "/credit-transactions",
        roles: ["admin", "manager"],
      },
      {
        id: 29,
        title: "Credit  Balance",
        url: "/credit-balance",
        roles: ["admin", "manager"],
      },
    ],
  },
  //   {
  //     id: 30,
  //     title: "Settings",
  //     url: "/settings",
  //     color: "gray",
  //     icon: Settings,
  //     roles: ["admin", "sales"],
  //   },
];

export default menuItems;
