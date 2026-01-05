"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bell,
  Package,
  ShoppingCart,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Archive,
  MailOpen,
  Mail,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NotificationType = "order" | "product" | "user" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority?: "low" | "medium" | "high";
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-2026-001 has been placed for TZS 2,500,000",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    priority: "high",
  },
  {
    id: "2",
    type: "product",
    title: "Low Stock Alert",
    message: "iPhone 15 Pro Max (256GB) has only 3 units left",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "user",
    title: "New User Registration",
    message: "John Doe has registered a new account",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: "4",
    type: "order",
    title: "Order Shipped",
    message: "Order #ORD-2025-999 has been marked as shipped",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "System Update",
    message: "The system will undergo maintenance on January 10, 2026",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    priority: "low",
  },
  {
    id: "6",
    type: "product",
    title: "Product Review",
    message: "MacBook Pro 16\" received a new 5-star review",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true,
  },
  {
    id: "7",
    type: "order",
    title: "Payment Received",
    message: "Payment confirmed for Order #ORD-2025-998",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    read: true,
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "order":
      return <ShoppingCart className="h-4 w-4" />;
    case "product":
      return <Package className="h-4 w-4" />;
    case "user":
      return <User className="h-4 w-4" />;
    case "system":
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "order":
      return "bg-blue-100 text-blue-600";
    case "product":
      return "bg-orange-100 text-orange-600";
    case "user":
      return "bg-green-100 text-green-600";
    case "system":
      return "bg-purple-100 text-purple-600";
  }
};

const getPriorityBadge = (priority?: "low" | "medium" | "high") => {
  if (!priority) return null;
  const colors = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-600",
  };
  return (
    <Badge variant="secondary" className={colors[priority]}>
      {priority}
    </Badge>
  );
};

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export default function InboxPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter(
    (n) => filter === "all" || n.type === filter
  );

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6 px-6 py-6 bg-gradient-to-r from-[#001E3C]/10 to-[#0A7EA4]/10 border border-[#0A7EA4]/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0A7EA4]/20 rounded-lg">
              <Bell className="h-6 w-6 text-[#0A7EA4]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
              <p className="text-gray-600">Manage your notifications and alerts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
            onCheckedChange={selectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedIds.length > 0 ? `${selectedIds.length} selected` : "Select all"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button variant="outline" size="sm" onClick={deleteSelected}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <MailOpen className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                {filter === "all" ? "All" : filter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("order")}>Orders</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("product")}>Products</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("user")}>Users</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mb-4 opacity-30" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <Checkbox
                      checked={selectedIds.includes(notification.id)}
                      onCheckedChange={() => toggleSelect(notification.id)}
                    />
                    <div
                      className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                        {getPriorityBadge(notification.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleRead(notification.id)}
                        title={notification.read ? "Mark as unread" : "Mark as read"}
                      >
                        {notification.read ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <MailOpen className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">Total notifications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {notifications.filter((n) => n.type === "order").length}
            </div>
            <p className="text-xs text-muted-foreground">Order alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter((n) => n.priority === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
