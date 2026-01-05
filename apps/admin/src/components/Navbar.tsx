"use client";

import { Moon, Settings, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "./ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import NavbarSearch from "./NavbarSearch";

const Navbar = () => {
  const { setTheme } = useTheme();

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-10 gap-4">
      {/* LEFT */}
      <SidebarTrigger />
      
      {/* CENTER - Search */}
      <NavbarSearch />
      
      {/* RIGHT */}
      <div className="flex items-center gap-4">
    
        {/* THEME MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* USER MENU - Clerk Managed */}
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 ring-2 ring-gray-200 hover:ring-[#FDB913] transition-all duration-200"
            }
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
              label="Settings"
              labelIcon={<Settings className="w-4 h-4" />}
              href="/settings"
            />
          </UserButton.MenuItems>
        </UserButton>
      </div>
    </nav>
  );
};

export default Navbar;
