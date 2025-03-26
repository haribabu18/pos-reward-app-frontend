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

function App() {


  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="index" element={<LandingPage />} />
            <Route path="/" element={<NavigateMain />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Product />} />
              <Route path="sales" element={<div>Sales Page</div>} />
              <Route path="customers" element={<div>Customers Page</div>} />
              <Route path="chat" element={<div>Chat Page</div>} />
              <Route path="email" element={<div>Email Page</div>} />
              <Route path="analytics" element={<div>Analytics Page</div>} />
              <Route path="integration" element={<div>Integration Page</div>} />
              <Route path="performance" element={<div>Performance Page</div>} />
              <Route path="account" element={<div>Account Page</div>} />
              <Route path="members" element={<div>Members Page</div>} />
              <Route path="settings" element={<div>Settings Page</div>} />
              <Route path="feedback" element={<div>Feedback Page</div>} />
            </Route>
            <Route path="*" element={<NavigateToProperRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const NavigateMain: React.FC = () => {
  const {isLoggedIn} = useAuth();
  return isLoggedIn?<Main />:<LandingPage/>
}


const NavigateToProperRoute = () => {
  const {isLoggedIn} = useAuth();
  return isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />;
};

export default App;
