"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UserRoleFormSchema, ROLE_CONFIGS, UserRole } from "@repo/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, RefreshCw, Shield, CheckCircle2, Loader2 } from "lucide-react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@clerk/nextjs/server";

type FormData = z.infer<typeof UserRoleFormSchema>;

interface AddUserSheetProps {
  user?: User;
  onSuccess?: () => void;
}

export default function AddUserSheet({ user, onSuccess }: AddUserSheetProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const isEditMode = !!user;
  const [showPassword, setShowPassword] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const userRole = (user?.publicMetadata?.role as UserRole) || "user";

  const form = useForm<FormData>({
    resolver: zodResolver(UserRoleFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      emailAddress: user?.emailAddresses[0]?.emailAddress || "",
      phoneNumber: user?.phoneNumbers?.[0]?.phoneNumber || "",
      role: userRole,
      status: "active",
      password: "",
    },
  });

  // Reset form when user changes (for edit mode)
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        emailAddress: user.emailAddresses[0]?.emailAddress || "",
        phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || "",
        role: userRole,
        status: "active",
        password: "",
      });
    }
  }, [user, form, userRole]);

  const selectedRole = form.watch("role") as UserRole;
  const watchedUsername = form.watch("username");
  const watchedPassword = form.watch("password");

  // Password strength calculator
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z\d]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  // Update password strength on change
  useState(() => {
    if (watchedPassword) {
      setPasswordStrength(calculatePasswordStrength(watchedPassword));
    }
  });

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 2) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/check-username?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  // Generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const length = 16;
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue("password", password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  // Create/Update user mutation
  const userMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const token = await getToken();
      
      if (isEditMode && user) {
        // Update existing user
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${user.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber || undefined,
              publicMetadata: {
                role: data.role,
                status: data.status,
              },
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update user");
        }

        return response.json();
      } else {
        // Create new user
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: data.firstName,
              lastName: data.lastName,
              username: data.username || undefined,
              emailAddress: [data.emailAddress],
              password: data.password,
              phoneNumber: data.phoneNumber || undefined,
              publicMetadata: {
                role: data.role,
                status: data.status,
              },
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create user");
        }

        return response.json();
      }
    },
    onSuccess: () => {
      if (isEditMode) {
        toast.success("User updated successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        if (user?.id) {
          queryClient.invalidateQueries({ queryKey: ["user", user.id] });
        }
      } else {
        toast.success("User created successfully");
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
      onSuccess?.();
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || `Failed to ${isEditMode ? "update" : "create"} user`);
    },
  });

  const onSubmit = (data: FormData) => {
    userMutation.mutate(data);
  };

  const roleConfig = ROLE_CONFIGS[selectedRole];
  const strengthColor =
    passwordStrength >= 75
      ? "bg-green-500"
      : passwordStrength >= 50
      ? "bg-yellow-500"
      : "bg-red-500";
  const strengthLabel =
    passwordStrength >= 75
      ? "Strong"
      : passwordStrength >= 50
      ? "Medium"
      : passwordStrength > 0
      ? "Weak"
      : "";

  return (
    <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
      <SheetHeader className="px-6 pt-6">
        <SheetTitle>{isEditMode ? "Edit User" : "Add New User"}</SheetTitle>
        <SheetDescription>
          {isEditMode 
            ? "Update user information and role permissions"
            : "Create a new user account with specific role and permissions"
          }
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="h-[calc(100vh-140px)] px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6 pb-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Basic Information</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        disabled={isEditMode}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {isEditMode ? "Email cannot be changed" : "Must be a valid email address"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>

              <div className="space-y-4">
                {!isEditMode && (
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="johndoe"
                              {...field}
                              onBlur={() => {
                                if (watchedUsername) {
                                  checkUsernameAvailability(watchedUsername);
                                }
                              }}
                            />
                            {checkingUsername && (
                              <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                            )}
                            {!checkingUsername && usernameAvailable !== null && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {usernameAvailable ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Badge variant="destructive" className="text-xs">
                                    Taken
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Optional unique username
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+255 123 456 789"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        International format
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Role Assignment */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role Assignment
              </h3>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ROLE_CONFIGS).map((config) => (
                          <SelectItem key={config.name} value={config.name}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${config.color}`}
                              />
                              {config.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Permissions Display */}
              {roleConfig && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-2 mb-2">
                    <Badge className={`${roleConfig.color} text-white text-xs`}>
                      {roleConfig.label}
                    </Badge>
                    <p className="text-xs text-gray-600">
                      {roleConfig.description}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">
                      Permissions:
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {roleConfig.permissions.slice(0, 4).map((permission) => (
                        <div
                          key={permission}
                          className="flex items-center gap-1 text-xs text-gray-600"
                        >
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span className="capitalize">
                            {permission.replace(/_/g, " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                    {roleConfig.permissions.length > 4 && (
                      <p className="text-xs text-gray-500">
                        +{roleConfig.permissions.length - 4} more permissions
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Settings */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-gray-700">Account Settings</h3>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Account Status</FormLabel>
                      <FormDescription className="text-xs">
                        Active accounts can sign in immediately
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === "active"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "active" : "inactive")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!isEditMode && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setPasswordStrength(
                                  calculatePasswordStrength(e.target.value)
                                );
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={generatePassword}
                            className="w-full"
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generate Random Password
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Minimum 8 characters required
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Password Strength Indicator */}
              {watchedPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Password Strength:</span>
                    <span className="font-medium">{strengthLabel}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strengthColor}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-2 pt-6 pb-2">
              <Button
                type="submit"
                disabled={userMutation.isPending}
                className="flex-1"
              >
                {userMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditMode ? "Update User" : "Create User"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </SheetContent>
  );
}
