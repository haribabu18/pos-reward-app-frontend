import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";


const capitalize = (path: string): string => {
  return path.charAt(0).toUpperCase() + path.substring(1);
};

export function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { user, isLoggedIn: isLoggedin, logout } = useAuth();
  const navigate = useNavigate();
  const userdata = {
    name: user?.username || "Login",
    phone: user?.phoneNumber || "",
    avatar: user?.username.charAt(0) || "",
  };

  // Initialize theme from localStorage or system preference
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

  return (
    <header className="flex py-2 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
        <h1 className="text-base font-medium">
          {capitalize(useLocation().pathname.substring(1))}
        </h1>
        <div className="ml-auto flex items-center">
          <Button className="rounded-full py-2 px-4">Add sale</Button>
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full ml-2"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <IconMoon size={20} /> : <IconSun size={20} />}
          </Button>
        </div>
      </div>
    </header>
  );
}
