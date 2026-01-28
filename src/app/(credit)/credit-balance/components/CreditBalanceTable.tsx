import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
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
import { creditBalanceProps } from "@/global/types";
import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";
import { ChevronDown } from "lucide-react";

type Props = {
  balances: creditBalanceProps[];
  filters: {
    customer: string;
    type: string;
    startDate: string;
    endDate: string;
  };
};

const CreditBalanceTable = ({ balances, filters }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const filteredBalances = useMemo(() => {
    return (
      balances.length &&
      balances?.filter((balance) => {
        return (
          (filters.customer === "" ||
            balance.customer?.name
              .toLowerCase()
              .includes(filters.customer.toLowerCase()) ||
            balance.supplier?.name
              .toLowerCase()
              .includes(filters.customer.toLowerCase())) &&
          (filters.type === "placeholder" ||
            filters.type === "" ||
            balance.type === filters.type)
        );
      })
    );
  }, [balances, filters]);

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
      selectedRows.map(({ id, customer, supplier, type, balance }) => ({
        ID: id,
        Client: customer ? customer.name : supplier.name,
        Type: type,
        Balance: balance,
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "selected_balances.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = useMemo<ColumnDef<creditBalanceProps>[]>(
    () => [
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
        accessorKey: "balance",
        header: "Balance",
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
                <DialogTitle>Balance Details</DialogTitle>
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
                <strong>Balance:</strong> {row.original.balance}
              </p>
            </DialogContent>
          </Dialog>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredBalances || [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex items-center py-4">
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

export default CreditBalanceTable;
