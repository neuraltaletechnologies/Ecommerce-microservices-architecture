import z from "zod";

export type UserRole = "user" | "admin" | "moderator" | "superadmin";
export type UserStatus = "active" | "inactive" | "locked";

export interface CustomJwtSessionClaims {
  metadata?: {
    role?: UserRole;
  };
  publicMetadata?: {
    role?: UserRole;
  };
}

export interface RoleConfig {
  name: UserRole;
  label: string;
  description: string;
  color: string;
  permissions: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  user: {
    name: "user",
    label: "User",
    description: "Standard user with basic access",
    color: "bg-blue-500",
    permissions: ["view_products", "create_orders", "manage_own_profile"],
  },
  moderator: {
    name: "moderator",
    label: "Moderator",
    description: "Can manage content and moderate users",
    color: "bg-purple-500",
    permissions: [
      "view_products",
      "create_orders",
      "manage_own_profile",
      "moderate_content",
      "view_users",
    ],
  },
  admin: {
    name: "admin",
    label: "Admin",
    description: "Full administrative access",
    color: "bg-orange-500",
    permissions: [
      "view_products",
      "create_orders",
      "manage_own_profile",
      "moderate_content",
      "view_users",
      "manage_users",
      "manage_products",
      "manage_orders",
      "view_analytics",
    ],
  },
  superadmin: {
    name: "superadmin",
    label: "Super Admin",
    description: "Highest level access with all permissions",
    color: "bg-red-500",
    permissions: [
      "view_products",
      "create_orders",
      "manage_own_profile",
      "moderate_content",
      "view_users",
      "manage_users",
      "manage_products",
      "manage_orders",
      "view_analytics",
      "manage_roles",
      "manage_settings",
      "system_admin",
    ],
  },
};

export const UserFormSchema = z.object({
  firstName: z
    .string({ message: "First name is required!" })
    .min(2, { message: "First name must be at least 2 characters!" })
    .max(50),
  lastName: z
    .string({ message: "Last name is required!" })
    .min(2, { message: "Last name must be at least 2 characters!" })
    .max(50),
  username: z
    .string({ message: "Username is required!" })
    .min(2, { message: "Username must be at least 2 characters!" })
    .max(50),
  emailAddress: z.array(z.string({ message: "Email address is required!" })),
  password: z
    .string({ message: "Password is required!" })
    .min(8, { message: "Password must be at least 8 characters!" })
    .max(50),
});

export const UserRoleFormSchema = z.object({
  firstName: z
    .string({ message: "First name is required!" })
    .min(2, { message: "First name must be at least 2 characters!" })
    .max(50),
  lastName: z
    .string({ message: "Last name is required!" })
    .min(2, { message: "Last name must be at least 2 characters!" })
    .max(50),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters!" })
    .max(50)
    .optional(),
  emailAddress: z
    .string()
    .email({ message: "Invalid email address" }),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" })
    .optional(),
  role: z.enum(["user", "admin", "moderator", "superadmin"], {
    message: "Please select a valid role",
  }),
  status: z.enum(["active", "inactive", "locked"], {
    message: "Please select a valid status",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters!" })
    .max(50)
    .optional(),
});
