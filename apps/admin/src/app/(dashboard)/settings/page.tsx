"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import Image from "next/image";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  
  // Profile settings
  const [displayName, setDisplayName] = useState(user?.fullName || "");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [userAlerts, setUserAlerts] = useState(false);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  
  // Appearance settings
  const [theme, setTheme] = useState("system");
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Regional settings
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("TZS");
  const [timezone, setTimezone] = useState("Africa/Dar_es_Salaam");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  const handleSaveProfile = () => {
    toast.success("Profile settings saved successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved successfully");
  };

  const handleSaveAppearance = () => {
    toast.success("Appearance settings saved successfully");
  };

  const handleSaveRegional = () => {
    toast.success("Regional settings saved successfully");
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6 px-6 py-6 bg-gradient-to-r from-[#001E3C]/10 to-[#0A7EA4]/10 border border-[#0A7EA4]/30 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0A7EA4]/20 rounded-lg">
            <SettingsIcon className="h-6 w-6 text-[#0A7EA4]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="regional" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Regional</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                  {user?.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{user?.fullName || "Admin User"}</h3>
                  <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                  <Badge variant="secondary" className="mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Administrator
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue={user?.firstName || ""}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue={user?.lastName || ""}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email is managed through Clerk authentication
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How you want to be displayed"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="space-y-4 pl-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Order Alerts</h4>
                      <p className="text-sm text-muted-foreground">
                        New orders, cancellations, and updates
                      </p>
                    </div>
                    <Switch
                      checked={orderAlerts}
                      onCheckedChange={setOrderAlerts}
                      disabled={!emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Stock Alerts</h4>
                      <p className="text-sm text-muted-foreground">
                        Low stock and out of stock notifications
                      </p>
                    </div>
                    <Switch
                      checked={stockAlerts}
                      onCheckedChange={setStockAlerts}
                      disabled={!emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">User Alerts</h4>
                      <p className="text-sm text-muted-foreground">
                        New registrations and user activity
                      </p>
                    </div>
                    <Switch
                      checked={userAlerts}
                      onCheckedChange={setUserAlerts}
                      disabled={!emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">System Alerts</h4>
                      <p className="text-sm text-muted-foreground">
                        Maintenance, updates, and security alerts
                      </p>
                    </div>
                    <Switch
                      checked={systemAlerts}
                      onCheckedChange={setSystemAlerts}
                      disabled={!emailNotifications}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive browser push notifications
                    </p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the dashboard looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    onClick={() => setTheme("light")}
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-colors ${
                      theme === "light" ? "border-[#0A7EA4] bg-[#0A7EA4]/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Sun className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Light</span>
                  </div>
                  <div
                    onClick={() => setTheme("dark")}
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-colors ${
                      theme === "dark" ? "border-[#0A7EA4] bg-[#0A7EA4]/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Moon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Dark</span>
                  </div>
                  <div
                    onClick={() => setTheme("system")}
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-colors ${
                      theme === "system" ? "border-[#0A7EA4] bg-[#0A7EA4]/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Monitor className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">System</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Layout Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Compact Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Reduce spacing for more content on screen
                    </p>
                  </div>
                  <Switch
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Collapsed Sidebar by Default</h4>
                    <p className="text-sm text-muted-foreground">
                      Start with the sidebar minimized
                    </p>
                  </div>
                  <Switch
                    checked={sidebarCollapsed}
                    onCheckedChange={setSidebarCollapsed}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAppearance}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Tab */}
        <TabsContent value="regional">
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure language, currency, and timezone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TZS">TZS - Tanzanian Shilling</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Dar_es_Salaam">Africa/Dar es Salaam (EAT)</SelectItem>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveRegional}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
