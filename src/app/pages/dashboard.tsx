import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { products, SectionCards } from "@/components/section-cards";
import { useAuth } from "@/app/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import data from "./data.json";
const adata = {
  products: [
    {
      id: 1,
      name: "Product 1",
      sold: "1000",
      stock: "3000",
    },
  ],
  sectiondata: [
    {
      id: 1,
      title: "Total Revenue",
      value: "1582",
      trend: "up",
      percent: "12.5%",
    },
    {
      id: 2,
      title: "Total Orders",
      value: "1345",
      trend: "down",
      percent: "20%",
    },
    {
      id: 3,
      title: "Total Customers",
      value: "1000",
      trend: "up",
      percent: "12.5%",
    },
    {
      id: 4,
      title: "Rewards Given",
      value: "1000",
      trend: "up",
      percent: "4.5%",
    },
  ],
};

// Add this function outside the component:


const Dashboard = () => {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    // return <Navigate to="/login" />;
    console.log("not logged in"); // Redirect if not authenticated
  } else {
    console.log("logged in"); // Redirect if not authenticated
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards data={adata.sectiondata} products={adata.products} />
      <DataTable data={data} />
    </div>          
  );
};

export default Dashboard;