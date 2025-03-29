"use client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Main from "./pages/main";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import Dashboard from "./pages/dashboard";
import LoginPage from "./authentication/loginpage";
import SignupPage from "./authentication/signuppage";
import Product from "./pages/productpage";
import LandingPage from "./pages/LandingPage";
import CustomerLayout from "./pages/CustomerLayout";
import { ReactNode } from "react";
import AddSale from "./pages/AddSale";

// ProtectedRoute Component
interface ProtectedRouteProps {
  children: ReactNode;
  requireShopkeeper?: boolean;
  requireCustomer?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireShopkeeper = false,
  requireCustomer = false,
}) => {
  const { isLoggedIn, user } = useAuth();

  // If not logged in, redirect to landing page
  if (!isLoggedIn) {
    return <Navigate to="/index" replace />;
  }

  // If requiring a shopkeeper but user is not a shopkeeper
  if (requireShopkeeper && user?.role.toLowerCase() !== "shopkeeper") {
    return <Navigate to="/customer/home" replace />;
  }

  // If requiring a customer but user is not a customer
  if (requireCustomer && user?.role.toLowerCase() !== "customer") {
    return <Navigate to="/shopkeeper/dashboard" replace />;
  }

  return <>{children}</>;
};

// NavigateMain Component for Root Route
const NavigateMain: React.FC = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/index" replace />;
  }

  // Redirect based on role
  if (user?.role.toLowerCase() === "shopkeeper") {
    return <Navigate to="/shopkeeper/dashboard" replace />;
  } else {
    return <Navigate to="/customer/home" replace />;
  }
};

// NavigateToProperRoute Component for 404
const NavigateToProperRoute: React.FC = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/index" replace />;
  }

  // Redirect based on role
  if (user?.role.toLowerCase() === "shopkeeper") {
    return <Navigate to="/shopkeeper/dashboard" replace />;
  } else {
    return <Navigate to="/customer/home" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Shopkeeper Routes */}
          <Route
            path="/shopkeeper"
            element={
              <ProtectedRoute requireShopkeeper>
                <Main />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Product />} />
            <Route path="sales" element={<div>Shopkeeper Sales</div>} />
            <Route path="sales/new" element={<AddSale/>} />
            <Route path="customers" element={<div>Shopkeeper Customers</div>} />
            <Route path="chat" element={<div>Shopkeeper Chat</div>} />
            <Route path="settings" element={<div>Shopkeeper Settings</div>} />
            <Route path="account" element={<div>Shopkeeper Account</div>} />
            <Route path="billing" element={<div>Shopkeeper Billing</div>} />
          </Route>

          {/* Customer Routes */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute requireCustomer>
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<div>Customer Home Page</div>} />
            <Route path="rewards" element={<div>Customer Rewards</div>} />
            <Route path="shops" element={<div>Customer Shops</div>} />
            <Route path="account" element={<div>Customer Account</div>} />
          </Route>

          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/index" element={<LandingPage />} />
          <Route path="/" element={<NavigateMain />} />

          {/* 404 Route */}
          <Route path="*" element={<NavigateToProperRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;