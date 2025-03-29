import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom"; // Import Outlet
import {
  IconHome,
  IconGift,
  IconBuildingStore,
  IconUser,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CustomerUser } from "@/components/customer-user";
import { useAuth } from "../context/AuthContext";

const capitalize = (path: string): string => {
  return path.charAt(0).toUpperCase() + path.substring(1);
};

function extractFirstLetters(name: string): string {
  const words = name.trim().split(" ");
  console.log(words);
  if (words.length > 0) {
    const firstLetters = words.map((word) => word.charAt(0));
    return firstLetters.join("");
  }
  return "";
}

const CustomerLayout: React.FC = () => {
  const { user } = useAuth();

  const userdata = {
    name: user?.username || "",
    phone: user?.phoneNumber || "",
    avatar: extractFirstLetters(user?.username || ""),
  };

  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navItems = [
    {
      name: "Home",
      path: "/customer/home",
      icon: <IconHome className="h-5 w-5" />,
    },
    {
      name: "Rewards",
      path: "/customer/rewards",
      icon: <IconGift className="h-5 w-5" />,
    },
    {
      name: "Shops",
      path: "/customer/shops",
      icon: <IconBuildingStore className="h-5 w-5" />,
    },
    {
      name: "Account",
      path: "/customer/account",
      icon: <IconUser className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-sidebar flex">
      {/* Sidebar Navigation for Larger Devices */}
      <aside className="hidden md:block bg-sidebar w-64">
        <div className="p-4">
          <h2 className="text-xl font-bold text-foreground mb-6">Reward App</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col  md:border rounded-xl md:m-2 bg-background">
        <header className="flex py-2 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-2 md:px-4 lg:gap-2 lg:px-6">
            <h1 className="text-base font-medium hidden md:block">
              {capitalize(useLocation().pathname.substring(10))}
            </h1>
            <div className="ml-auto flex items-center w-full justify-between md:size-max">
              <CustomerUser data={userdata} />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4 ml-4 hidden md:block"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full ml-2"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <IconMoon size={20} />
                ) : (
                  <IconSun size={20} />
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 pb-16 md:pb-6">
          <Outlet /> {/* Replace children with Outlet */}
        </main>

        {/* Bottom Navigation for Mobile Devices */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-sm md:hidden">
          <div className="flex justify-around py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-4 py-2 ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default CustomerLayout;
