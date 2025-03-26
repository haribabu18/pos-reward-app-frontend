import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MemoizedAppSidebar = React.memo(AppSidebar);
const MemoizedSiteHeader = React.memo(SiteHeader);

export default function Main() {
  const { isLoggedIn } = useAuth();

  return (
    <SidebarProvider style={
      {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties
    }
    >
      <MemoizedAppSidebar variant="inset"/>
      <SidebarInset >
        <MemoizedSiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 px-4">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}