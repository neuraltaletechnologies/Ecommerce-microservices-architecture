import { Router } from "express";
import clerkClient from "../utils/clerk";
import { sendUserWelcomeEmail } from "../utils/email";

const router: Router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await clerkClient.users.getUserList();
    // Clerk returns { data: User[], totalCount: number }
    res.status(200).json({
      data: users.data || [],
      totalCount: users.totalCount || 0
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    console.error("Error details:", {
      message: error?.message,
      status: error?.status,
      clerkError: error?.clerkError
    });
    res.status(500).json({
      data: [],
      totalCount: 0,
      error: error?.message || "Failed to fetch users"
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await clerkClient.users.getUser(id);
  res.status(200).json(user);
});

router.post("/", async (req, res) => {
  try {
    type CreateParams = Parameters<typeof clerkClient.users.createUser>[0];
    const newUser: CreateParams = req.body;
    const user = await clerkClient.users.createUser(newUser);
    // Send welcome email directly
    await sendUserWelcomeEmail(
      user.emailAddresses[0]?.emailAddress || '',
      user.username || ''
    );
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: error?.message || "Failed to create user"
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await clerkClient.users.deleteUser(id);
  res.status(200).json(user);
});

export default router;
