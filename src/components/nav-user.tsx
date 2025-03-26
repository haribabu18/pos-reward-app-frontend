"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import { useContext } from "react";







export function NavUser({data : userdata}:{data : {name: string, phone: string, avatar: string}}) {

  const { token, setToken, isLoggedIn, setIsLoggedIn} = useAuth();
  
  const { isMobile } = useSidebar();

  const navigate = useNavigate();

  const login = () => {
    navigate("/login");
  }

  const logout = async () => {
    localStorage.removeItem('token');
    setToken('');
    setIsLoggedIn(false);
    await alert('Logged out successfully');
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={userdata.avatar} alt={userdata.name} />
                <AvatarFallback className="rounded-lg">{userdata.avatar.toUpperCase()}</AvatarFallback>
              </Avatar>{" "}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {userdata.name.length > 1 ? userdata.name : "Login"}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {userdata.phone}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {userdata.name.length > 1 ? 
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userdata.avatar} alt={userdata.name} />
                  <AvatarFallback className="rounded-lg">{userdata.avatar.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userdata.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userdata.phone}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
          :
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={login}>
              <IconLogout />
              Log In
            </DropdownMenuItem>
          </DropdownMenuContent>
          }
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
