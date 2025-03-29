import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconChevronRight,
  IconChevronLeft,
  IconTrendingUp,
  IconPlus,
  IconMinus,
} from "@tabler/icons-react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { AreaChart, Area, ResponsiveContainer, ErrorBar } from "recharts";

const api = axios.create({
  baseURL: "http://localhost:8081/api", // Adjust to your Spring Boot backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

const totalProductsTrend = [
  { value: 5 },
  { value: 10 },
  { value: 5 },
  { value: 20 },
  { value: 15 },
  { value: 30 },
  { value: 25 },
  { value: 40 },
];

const inventoryValueTrend = [
  { value: 10 },
  { value: 20 },
  { value: 15 },
  { value: 25 },
  { value: 20 },
  { value: 35 },
  { value: 30 },
  { value: 50 },
];

interface ProductFormData {
  store: string;
  name: string;
  price: number;
}

interface EditProductFormData {
  id: number;
  store: string;
  name: string;
  price: number;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
}
interface Summary {
  totalProducts: String;
  inventoryValue: String;
  inventorytend: Number;
  inventorytendvalue: Number;
  productstendvalue: Number;
  productstend: Number;
  topSellingProducts: { name: string; sold: number; stockQuantity: number }[];
}

const fetchProducts = async () => {
  const token = localStorage.getItem("token"); // Get JWT token from storage
  const response = await axios.get("http://localhost:8081/api/products", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add token if authentication is required
    },
  });
  console.log(response); // Log the response data to the console
  return response.data;
};

const fetchSummary = async (): Promise<Summary> => {
  const response = await api.get("/products/summary");
  return response.data;
};

const deleteProduct = async (id: number): Promise<void> => {
  console.log("Deleting product with ID:", id);
  const token = localStorage.getItem("token"); // Get JWT token from storage

  const response = await axios.delete(
    "http://localhost:8081/api/products/" + id,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Add token if authentication is required
      },
    }
  );
  return response.data;
};

const addProduct = async (product: ProductFormData) => {
  const token = localStorage.getItem("token"); // Get JWT token from storage

  const response = await axios.post(
    "http://localhost:8081/api/products",
    product,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token if authentication is required
      },
    }
  );
  return response.data;
}; // Add this function to your ProductsPage component

const updateProduct = async (
  id: number,
  product: Partial<ProductFormData>
): Promise<ProductFormData> => {
  const token = localStorage.getItem("token"); // Get JWT token from storage

  console.log(product);

  const response = await axios.put(
    "http://localhost:8081/api/products/" + id,
    product,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token if authentication is required
      },
    }
  );
  return response.data;
};

// src/pages/Products.tsx

import productdata from "./productdata.json"; // Import the mock data // Import the mock data
import summarydata from "./summary.json"; // Import the mock data
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { set } from "zod";
import { log } from "console";

const Products: React.FC = () => {
  const { isLoggedIn, user } = useAuth();

  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/login");
  } else if (user?.role.toLowerCase() !== "shopkeeper") {
    navigate("/");
  }

  const [data, setData] = useState<Product[]>(productdata); // Load initial data
  const [summary, setSummary] = useState<Summary>(summarydata);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [formdata, setFormdata] = useState<ProductFormData>({
    store: localStorage.getItem("store") || "",
    name: "",
    price: 0,
  }); // Initial form data

  const [editFormdata, setEditFormdata] = useState<EditProductFormData>({
    id: 0,
    store: localStorage.getItem("store") || "",
    name: "",
    price: 0,
  }); // Initial form data

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0, // TanStack Table uses 0-based indexing
    pageSize: 10,
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch summary on mount
  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      try {
        // const summaryData = await fetchSummary();
        const summaryData = summarydata;
        setSummary(summaryData);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  const loadProducts = async (): Promise<Product[] | undefined> => {
    setLoading(true);
    try {
      const productsData = await fetchProducts();
      if (productsData.length > 0) {
        setData(productsData);
        console.log("Products loaded:", productsData);
        return productsData; // Return the fetched data for further use
      } else {
        setData(productdata);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Define columns for TanStack Table
  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <div>₹{Math.round(row.getValue("price"))}</div>,
      },
      {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => <div>{row.getValue("sku")}</div>,
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleEditProduct(row.original.id)}
              >
                <IconEdit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
                <IconTrash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      const data = await deleteProduct(id);
      console.log("Product deleted:", data);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Initialize TanStack Table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  function validateForm(): boolean {
    if (formdata.name.length < 3) {
      console.log("Name must be at least 3 characters long.");
      return false;
    }
    if (formdata.price <= 0) {
      console.log("Price must be a positive number.");
      return false;
    }
    return true;
  }

  async function handlesubmitproduct() {
    // Handle form submission logic here
    if (validateForm()) {
      if (isLoggedIn) {
        console.log("Form submitted with data:", formdata);
        const response = await addProduct(formdata);
        console.log(response.data);
        await loadProducts();
        setIsDialogOpen(false);
      } else {
        alert("Please login to add a product.");
      }
    }
  }

  async function handleEditProduct(id: number) {
    const products = await fetchProducts();
    const product = products.find((p: Product) => p.id === id);
    setEditFormdata({
      id: product.id,
      store: product.store,
      name: product.name,
      price: product.price,
    });
    setIsEditDialogOpen(true);
  }

  async function handleUpdateProduct() {
    try {
      const id = editFormdata.id;
      const data = {
        store: editFormdata.store,
        name: editFormdata.name,
        price: editFormdata.price,
      }; // Initial form data
      console.log("updating data : " + data);
      const response = await updateProduct(id, data);
      console.log(response);
      await loadProducts();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditFormdata((prev) => ({ ...prev, [name]: value }));
    console.log("enterning data : " + name + " " + value);
  }

  return (
    <div className="p-4">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
        {/* Total Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full flex flex-col justify-between min-h-20">
            {loading ? (
              <Skeleton className="h-20 w-32" />
            ) : (
              <p className="text-3xl md:text-4xl font-bold">
                ₹{summary?.totalProducts || "5,000"}
              </p>
            )}
            {summary?.productstend === 1 ? (
              <div className="flex flex-row gap-2 items-center">
                <p className="text-sm text-[var(--trend-positive)] bg-[var(--trend-positive-bg)] border-[var(--trend-positive-border)] border px-2 max-w-max py-1 rounded-full flex flex-row items-center">
                  <IconPlus stroke={1.75} height={20} />
                  {Number(summary?.productstendvalue)}%
                </p>
                <p className="text-sm">than last day</p>
              </div>
            ) : null}
            {summary?.productstend === -1 ? (
              <div className="flex flex-row gap-2 items-center">
                <p className="text-sm text-[var(--trend-negative)] bg-[var(--trend-negative-bg)] border-[var(--trend-negative-border)] border px-2 max-w-max py-1 rounded-full flex flex-row items-center">
                  <IconMinus stroke={1.75} height={20} />
                  {Number(summary?.productstendvalue)}%
                </p>
                <p className="text-sm">than last day</p>
              </div>
            ) : null}
            {summary?.productstend === 0 ? (
              <div className="flex flex-row gap-2 items-center">
                <p className="text-sm text-[var(--trend-neutral)] bg-[var(--trend-neutral-bg)] border-[var(--trend-neutral-border)] border px-2 max-w-max py-1 rounded-full flex flex-row items-center">
                  neutral
                </p>
                <p className="text-sm">no change</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Total Inventory Value */}
        <Card className="lg:col-span-2 ">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full flex flex-col justify-between min-h-22">
            {loading ? (
              <Skeleton className="h-20 w-32" />
            ) : (
              <p className="text-4xl font-bold">
                ₹{summary?.inventoryValue || "5,50,000"}
              </p>
            )}
            {summary?.inventorytend === 1 ? (
              <div className="flex flex-row gap-2 items-center">
                <p className="text-sm text-[var(--trend-positive)] bg-[var(--trend-positive-bg)] border-[var(--trend-positive-border)] border px-2 max-w-max py-1 rounded-full flex flex-row items-center">
                  <IconPlus stroke={1.75} height={20} />
                  {Number(summary?.inventorytendvalue)}%
                </p>
                <p className="text-sm">than last day</p>
              </div>
            ) : null}
            {summary?.inventorytend === -1 ? (
              <div className="flex flex-row gap-2 items-center">
                <p className="text-sm text-[var(--trend-negative)] bg-[var(--trend-negative-bg)] border-[var(--trend-negative-border)] border px-2 max-w-max py-1 rounded-full flex flex-row items-center">
                  <IconMinus stroke={1.75} height={20} />
                  {Number(summary?.inventorytendvalue)}%
                </p>
                <p className="text-sm">than last day</p>
              </div>
            ) : null}
            {summary?.inventorytend === 0 ? (
              <div className="flex flex-row gap-2 items-center">
                <p className="text-sm text-[var(--trend-neutral)] bg-[var(--trend-neutral-bg)] border-[var(--trend-neutral-border)] border px-2 max-w-max py-1 rounded-full flex flex-row items-center">
                  neutral
                </p>
                <p className="text-sm">no change</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Top Selling Products (unchanged) */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">
              Top Selling Products
            </CardTitle>
            <Select defaultValue="this-week">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="This week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-week">This week</SelectItem>
                <SelectItem value="this-month">This month</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-12 w-full" />
            ) : summary &&
              summary.topSellingProducts &&
              summary.topSellingProducts.length > 0 ? (
              <div className="space-y-2">
                {summary.topSellingProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0"
                  >
                    <span className="flex-1 font-medium">{product.name}</span>
                    <span className="flex-1 text-center">
                      {product.sold} sold
                    </span>
                    <span className="flex-1 text-right">
                      {product.stockQuantity} in stock
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="flex-1 font-medium">Product One</span>
                  <span className="flex-1 text-center">100 sold</span>
                  <span className="flex-1 text-right">50 in stock</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex-1 font-medium">Product Two</span>
                  <span className="flex-1 text-center">60 sold</span>
                  <span className="flex-1 text-right">20 in stock</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product List Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <CardTitle>Product List</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Input
                placeholder="Search products"
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table.getColumn("name")?.setFilterValue(e.target.value)
                }
                className="w-full md:w-40"
              />
              <Select
                value={sorting[0]?.id || "name"}
                onValueChange={(value) => {
                  setSorting([{ id: value, desc: false }]);
                }}
              >
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="sku">SKU</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Add Product</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 pb-4">
                    <DialogDescription>
                      Fill in the details of the new product.
                    </DialogDescription>
                    <Input
                      onChange={handleInputChange}
                      name="name"
                      value={formdata.name}
                      placeholder="Product Name"
                    />
                    <Input
                      onChange={handleInputChange}
                      name="price"
                      value={formdata.price}
                      placeholder="Price"
                      type="number"
                    />
                    <Button onClick={handlesubmitproduct}>Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
      </div>
      <Card>
        <CardContent>
          {/* Product Table */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 pb-4">
                <DialogDescription>Edit {editFormdata.name}</DialogDescription>
                <Input
                  onChange={handleEditInputChange}
                  name="name"
                  value={editFormdata.name}
                  placeholder="Product Name"
                />
                <Input
                  onChange={handleEditInputChange}
                  name="price"
                  value={Math.round(editFormdata.price)}
                  placeholder="Price"
                  type="number"
                />
                <Button onClick={handleUpdateProduct}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between mt-4 gap-4">
            {/* Pagination Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
            </div>

            {/* Rows Per Page */}
            <div className="flex flex-col sr-only sm:not-sr-only sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Rows per page:</span>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
