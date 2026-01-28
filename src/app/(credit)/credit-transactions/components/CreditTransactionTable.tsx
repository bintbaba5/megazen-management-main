import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreditTransactionProps } from "@/global/types";
import { toast } from "@/hooks/use-toast";
import Papa from "papaparse";
import { ChevronDown } from "lucide-react";

type Props = {
  transactions: CreditTransactionProps[];
  filters: {
    customer: string;
    type: string;
    startDate: string;
    endDate: string;
  };
};

const CreditTransactionTable = ({ transactions, filters }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) => {
      return (
        (filters.customer === "" ||
          transaction.customer?.name
            .toLowerCase()
            .includes(filters.customer.toLowerCase()) ||
          transaction.supplier?.name
            .toLowerCase()
            .includes(filters.customer.toLowerCase())) &&
        (filters.type === "placeholder" ||
          filters.type === "" ||
          transaction.type === filters.type) &&
        (filters.startDate === "" ||
          new Date(transaction.date) >= new Date(filters.startDate)) &&
        (filters.endDate === "" ||
          new Date(transaction.date) <= new Date(filters.endDate))
      );
    });
  }, [transactions, filters]);

  const columns: ColumnDef<CreditTransactionProps>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          {row.original.customer
            ? row.original.customer.name
            : row.original.supplier.name}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div>
          {new Date(row.original.date).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      header: "Action",
      id: "actions",
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            <p>
              <strong>ID:</strong> {row.original.id}
            </p>
            <p>
              <strong>Customer:</strong>{" "}
              {row.original.customer
                ? row.original.customer.name
                : row.original.supplier.name}
            </p>
            <p>
              <strong>Type:</strong> {row.original.type}
            </p>
            <p>
              <strong>Amount:</strong> {row.original.amount}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(row.original.date).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
            <p>
              <strong>Description:</strong> {row.original.description}
            </p>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  const handleDownloadCSV = () => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);

    if (selectedRows.length === 0) {
      toast({
        title: "No rows selected",
        description: "Please select at least one row to download.",
      });
      return;
    }

    const csv = Papa.unparse(
      selectedRows.map(
        ({ id, customer, supplier, type, amount, date, description }) => ({
          ID: id,
          Client: customer ? customer.name : supplier.name,
          Type: type,
          Amount: amount,
          Date: new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          Description: description,
        })
      )
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "selected_balances.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const table = useReactTable({
    data: filteredTransactions,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination, // Add pagination state
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination, // Add pagination change handler
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Filter by customer..."
          value={
            (table.getColumn("customer")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("customer")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        /> */}
        <Button
          variant={"outline"}
          onClick={handleDownloadCSV}
          className="ml-2"
        >
          Download CSV
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreditTransactionTable;
