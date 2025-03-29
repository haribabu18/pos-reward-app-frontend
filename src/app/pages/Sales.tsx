import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTrash, IconEye } from "@tabler/icons-react";

// Define the Sale type
interface Sale {
  id: string;
  date: string;
  customer: { id: string; name: string; email: string };
  amount: number;
  rewardsGiven: number;
}

const Sales: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Fetch sales data
  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8081/api/transactions", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSales(response.data);
      } catch (err) {
        setError("Failed to load sales. Please try again.");
        console.error("Error fetching sales:", err);
        // Mock data for development
        setSales([
          {
            id: "TXN001",
            date: "2025-03-25T10:00:00Z",
            customer: { id: "CUST001", name: "John Doe", email: "john@example.com" },
            amount: 1500,
            rewardsGiven: 75, // 5% of amount
          },
          {
            id: "TXN002",
            date: "2025-03-24T14:30:00Z",
            customer: { id: "CUST002", name: "Jane Smith", email: "jane@example.com" },
            amount: 3000,
            rewardsGiven: 150,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  // Define table columns
  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "id",
      header: "Transaction ID",
      cell: ({ row }) => <span>{row.getValue("id")}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <span>{format(new Date(row.getValue("date")), "PPP, p")}</span>,
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.getValue("customer") as Sale["customer"];
        return <span>{customer.name} ({customer.email})</span>;
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span>₹{row.getValue("amount")}</span>,
    },
    {
      accessorKey: "rewardsGiven",
      header: "Rewards Given",
      cell: ({ row }) => <span>{row.getValue("rewardsGiven")} points</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/shopkeeper/sales/${row.getValue("id")}`)}
          >
            <IconEye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.getValue("id"))}
          >
            <IconTrash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Handle delete sale
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSales(sales.filter((sale) => sale.id !== id));
    } catch (err) {
      setError("Failed to delete sale. Please try again.");
      console.error("Error deleting sale:", err);
    }
  };

  // Filter sales based on search
  const filteredSales = sales.filter(
    (sale) =>
      sale.id.toLowerCase().includes(search.toLowerCase()) ||
      sale.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      sale.customer.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by transaction ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            {/* Add date range filter here if needed */}
          </div>

          {loading && <p className="text-muted-foreground">Loading sales...</p>}
          {error && <p className="text-destructive mb-4">{error}</p>}

          {!loading && !error && (
            // <DataTable columns={columns} data={filteredSales} />""
            ""
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;