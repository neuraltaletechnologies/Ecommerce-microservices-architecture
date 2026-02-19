"use client";

import {
  Home,
  Inbox,
  Settings,
  Plus,
  Laptop,
  User,
  Package,
  Boxes,
  Star,
  CreditCard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetTrigger } from "./ui/sheet";
import AddOrder from "./AddOrder";
import AddUserSheet from "./AddUserSheet";
import AddCategory from "./AddCategory";
import AddProductApiFirst from "./AddProductApiFirst";
import AddProduct from "./AddProduct";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const AppSidebar = () => {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid SSR hydration mismatches from Radix-generated IDs
  if (!mounted) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/logo.png" alt="Neurashop Logo" width={24} height={24} className="object-contain" />
                <span>Neurashop</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title === "Inbox" && (
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Tech Products</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Tech Product</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/hero-products">
                    <Star />
                    Hero Products
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/products">
                    <Laptop />
                    All Products
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <AddProductSidebarItem />
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/categories">
                    <Boxes />
                    Categories
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
        
              <SidebarMenuItem>
                <Sheet>
                  <SheetTrigger asChild>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Plus />
                        Add Category
                      </Link>
                    </SidebarMenuButton>
                  </SheetTrigger>
                  <AddCategory />
                </Sheet>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Users</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add User</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/users">
                    <User />
                    All Users
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Sheet>
                  <SheetTrigger asChild>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Plus />
                        Add User
                      </Link>
                    </SidebarMenuButton>
                  </SheetTrigger>
                  <AddUserSheet />
                </Sheet>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Orders & Payments</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Order</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/orders">
                    <Package />
                    All Orders
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Sheet>
                    <SheetTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link href="#">
                          <Plus />
                          Add Order
                        </Link>
                      </SidebarMenuButton>
                    </SheetTrigger>
                    <AddOrder />
                  </Sheet>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-12 hover:bg-gray-100 dark:hover:bg-gray-800">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 ring-2 ring-gray-200 hover:ring-[#FDB913] transition-all duration-200",
                    userButtonPopoverCard: "shadow-lg"
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
              <div className="flex flex-col items-start text-left ml-2 overflow-hidden">
                <span className="text-sm font-medium truncate w-full">
                  {isLoaded && user ? user.fullName || "User" : "Loading..."}
                </span>
                <span className="text-xs text-muted-foreground truncate w-full">
                  {isLoaded && user ? user.primaryEmailAddress?.emailAddress : ""}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

// Separate component for Add Product with sheet state
function AddProductSidebarItem() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"api" | "manual">("api");
  const router = useRouter();

  return (
    <SidebarMenuItem>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <SidebarMenuButton asChild>
            <Link href="#" onClick={() => setMode("api")}>
              <Plus />
              Add Product
            </Link>
          </SidebarMenuButton>
        </SheetTrigger>
        {mode === "api" ? (
          <AddProductApiFirst
            onOpenManualForm={() => setMode("manual")}
            onClose={() => {
              setOpen(false);
              setMode("api");
              router.refresh();
            }}
          />
        ) : (
          <AddProduct
            onSuccess={() => {
              setOpen(false);
              setMode("api");
              router.refresh();
            }}
          />
        )}
      </Sheet>
    </SidebarMenuItem>
  );
}

export default AppSidebar;
