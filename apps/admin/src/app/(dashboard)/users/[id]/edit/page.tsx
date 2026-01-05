"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import type { User } from "@clerk/nextjs/server";
import { Skeleton } from "@/components/ui/skeleton";

// Make password optional for edit
const EditUserSchema = UserRoleFormSchema.extend({
  password: z.string().min(8).max(50).optional().or(z.literal("")),
});

type FormData = z.infer<typeof EditUserSchema>;

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { getToken } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      emailAddress: "",
      phoneNumber: "",
      role: "user",
      status: "active",
      password: "",
    },
  });

  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return response.json() as Promise<User>;
    },
  });

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      const role = (user.publicMetadata?.role as UserRole) || "user";
      const status = user.banned ? "inactive" : user.locked ? "locked" : "active";
      
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        emailAddress: user.emailAddresses[0]?.emailAddress || "",
        phoneNumber: (user.publicMetadata?.phoneNumber as string) || "",
        role,
        status,
        password: "",
      });
    }
  }, [user, form]);

  const selectedRole = form.watch("role") as UserRole;

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const token = await getToken();
      
      interface PublicMetadata {
        role: UserRole;
        phoneNumber?: string;
        banned?: boolean;
        locked?: boolean;
      }

      interface UpdateData {
        firstName: string;
        lastName: string;
        username?: string;
        password?: string;
        publicMetadata: PublicMetadata;
      }

      const updateData: UpdateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username || undefined,
        publicMetadata: {
          role: data.role,
          phoneNumber: data.phoneNumber || undefined,
        },
      };

      // Only include password if it's provided
      if (data.password && data.password.length > 0) {
        updateData.password = data.password;
      }

      // Handle status changes (ban/unban/lock)
      if (data.status === "inactive") {
        updateData.publicMetadata.banned = true;
        updateData.publicMetadata.locked = false;
      } else if (data.status === "locked") {
        updateData.publicMetadata.banned = false;
        updateData.publicMetadata.locked = true;
      } else {
        updateData.publicMetadata.banned = false;
        updateData.publicMetadata.locked = false;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update user");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      router.push("/users");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const onSubmit = (data: FormData) => {
    updateUserMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-9 w-28" />
        </div>

        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Form Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Role Preview Card */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">The requested user could not be found.</p>
          <Button asChild>
            <Link href="/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const roleConfig = ROLE_CONFIGS[selectedRole];

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
        <p className="text-gray-600 mt-2">
          Update user information, role, and permissions
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update the user&apos;s personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormDescription>
                      Email cannot be changed after account creation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional unique username
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <FormDescription>
                        International format recommended
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Role Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Assignment
              </CardTitle>
              <CardDescription>
                Assign a role to define user permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
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
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3 mb-3">
                    <Badge className={`${roleConfig.color} text-white`}>
                      {roleConfig.label}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      {roleConfig.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Permissions:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {roleConfig.permissions.map((permission) => (
                        <div
                          key={permission}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span className="capitalize">
                            {permission.replace(/_/g, " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Configure account status and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            Inactive
                          </div>
                        </SelectItem>
                        <SelectItem value="locked">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            Locked
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Control user access to the platform
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Leave blank to keep current password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Only fill this if you want to change the password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="w-full md:w-auto"
            >
              {updateUserMutation.isPending ? "Updating User..." : "Update User"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
