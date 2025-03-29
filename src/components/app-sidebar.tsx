"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconShoppingCart,
  IconCoin,
  IconMessage,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/app/context/AuthContext";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/shopkeeper/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/shopkeeper/products",
      icon: IconShoppingCart, // Changed to shopping cart icon
    },
    {
      title: "sales",
      url: "/shopkeeper/sales",
      icon: IconCoin, // Changed to coin icon for sales
    },
    {
      title: "Customers",
      url: "/shopkeeper/customers",
      icon: IconUsers, // Changed to users icon for customers
    },
    {
      title: "Chat",
      url: "/shopkeeper/chat",
      icon: IconMessage, // Changed to message icon for chat
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userdata = {
    name: user?.username || "",
    phone: user?.phoneNumber || "",
    avatar: extractFirstLetters(user?.username || ""),
  };

  return (
    <Sidebar collapsible="offcanvas" {...props} className="w-45 md:w-65">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src="/logo.svg" alt="logo" />
                  <AvatarFallback className="rounded-lg">L</AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold">Pos Rewards</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser data={userdata} />
      </SidebarFooter>
    </Sidebar>
  );
}
