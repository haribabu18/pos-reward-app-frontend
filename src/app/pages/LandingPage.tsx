import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  IconBuildingStore,
  IconUser,
  IconChartBar,
  IconShield,
  IconGift,
  IconWallet,
  IconMenu2,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const handleLoginClick = useCallback(() => navigate("/login"), [navigate]);
  const handleSignupClick = useCallback(() => navigate("/signup"), [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md py-4 fixed w-full z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="text-2xl font-bold">
            <a href="/" className="text-white hover:text-blue-400 transition-colors">
              Reward Points App
            </a>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
              Home
            </a>
            <a href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
              About Us
            </a>
            <a href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
              Contact Us
            </a>
          </nav>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconMenu2 className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gray-800 text-white">
                <nav className="flex flex-col space-y-4 mt-4">
                  <a href="/" className="text-gray-300 hover:text-blue-400">
                    Home
                  </a>
                  <a href="/about" className="text-gray-300 hover:text-blue-400">
                    About Us
                  </a>
                  <a href="/contact" className="text-gray-300 hover:text-blue-400">
                    Contact Us
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handleLoginClick}
              className="px-6 py-2 text-base border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
            >
              Sign In
            </Button>
            <Button
              onClick={handleSignupClick}
              className="px-6 py-2 text-base bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Build Customer Loyalty with Ease
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            A multi-industry reward system for small businesses to boost retention and engagement with AI-powered insights.
          </p>
          <Button
            size="lg"
            className="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            The Challenge for Small Businesses
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            Small businesses struggle with customer retention and loyalty. Existing loyalty programs are often expensive or limited to specific industries, and businesses lack data-driven insights to improve sales and engagement.
          </p>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Our Solution</h2>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            A flexible reward points system that works across industries. Shopkeepers set their own reward percentages, customers earn and redeem points, and AI-powered reports help optimize engagement and sales.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <IconBuildingStore className="h-6 w-6 text-blue-400" />
                  For Shopkeepers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Manage rewards, track sales, and gain insights with a powerful web dashboard.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <IconUser className="h-6 w-6 text-blue-400" />
                  For Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Earn points, redeem discounts, and enjoy personalized offers via a mobile app.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <IconChartBar className="h-6 w-6 text-blue-400" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Leverage AI to predict trends, detect churn, and optimize your business.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features for Shopkeepers */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center tracking-tight">
            Features for Shopkeepers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <IconGift className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Reward Management</h3>
                <p className="text-gray-300">
                  Set reward percentages, issue points, and manage redemptions easily.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconChartBar className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Sales Tracking</h3>
                <p className="text-gray-300">
                  Monitor sales and customer spending trends in real-time.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconUser className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Customer Management</h3>
                <p className="text-gray-300">
                  Maintain customer profiles and engagement data.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconBuildingStore className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Multi-Store Support</h3>
                <p className="text-gray-300">
                  Manage multiple stores under one account seamlessly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconShield className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Fraud Prevention</h3>
                <p className="text-gray-300">
                  Employee access control and automated fraud detection.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconChartBar className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">AI-Powered Reports</h3>
                <p className="text-gray-300">
                  Insights, churn prediction, and best-selling products analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features for Customers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center tracking-tight">
            Features for Customers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <IconWallet className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Reward Points Tracking</h3>
                <p className="text-gray-300">
                  View earned and redeemed points in one place.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconGift className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Easy Redemption</h3>
                <p className="text-gray-300">
                  Scan QR codes at stores for instant redemption.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconUser className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Personalized Offers</h3>
                <p className="text-gray-300">
                  Receive custom promotions based on your purchase history.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconUser className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Referral Program</h3>
                <p className="text-gray-300">
                  Invite friends and earn extra points.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconBuildingStore className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Multi-Shop Rewards Wallet</h3>
                <p className="text-gray-300">
                  Use one app for rewards across multiple stores.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconChartBar className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">AI-Generated Notifications</h3>
                <p className="text-gray-300">
                  Get expiry reminders and smart reward suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">AI-Powered Insights</h2>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            Leverage AI to grow your business with data-driven decisions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <IconChartBar className="h-6 w-6 text-blue-400" />
                  Customer Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Predict spending patterns and suggest personalized deals.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <IconUser className="h-6 w-6 text-blue-400" />
                  Churn Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Identify inactive customers and trigger re-engagement campaigns.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <IconChartBar className="h-6 w-6 text-blue-400" />
                  Sales Forecasting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Predict future sales based on historical data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing & Business Model */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Pricing Plans</h2>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            Start with a 30-day free trial, then choose a plan that fits your business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white">Basic</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">$10/month</p>
                <p className="text-gray-300 mt-2">Core features for small businesses.</p>
                <ul className="mt-4 text-gray-300 space-y-2">
                  <li>Reward Management</li>
                  <li>Sales Tracking</li>
                  <li>Customer Management</li>
                </ul>
                <Button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white">Standard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">$25/month</p>
                <p className="text-gray-300 mt-2">Advanced features for growing businesses.</p>
                <ul className="mt-4 text-gray-300 space-y-2">
                  <li>All Basic Features</li>
                  <li>Multi-Store Support</li>
                  <li>AI-Powered Reports</li>
                </ul>
                <Button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white">Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">$50/month</p>
                <p className="text-gray-300 mt-2">Full access for large businesses.</p>
                <ul className="mt-4 text-gray-300 space-y-2">
                  <li>All Standard Features</li>
                  <li>Fraud Prevention</li>
                  <li>Marketing & Promotions</li>
                </ul>
                <Button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Ready to Boost Your Business?
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-3xl mx-auto">
            Sign up for a 30-day free trial and start building customer loyalty today.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="email" className="sr-only">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-white border-gray-700 focus:ring-blue-500"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">© 2025 Reward Points App. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-4">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Contact Us
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;