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

// Check username availability
router.get("/check-username", async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username || typeof username !== "string") {
      return res.status(400).json({ 
        available: false, 
        error: "Username is required" 
      });
    }

    const users = await clerkClient.users.getUserList({
      username: [username],
    });
    
    res.status(200).json({
      available: users.data.length === 0,
    });
  } catch (error: any) {
    console.error("Error checking username:", error);
    res.status(500).json({
      available: false,
      error: error?.message || "Failed to check username availability"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await clerkClient.users.getUser(id);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: error?.message || "Failed to fetch user"
    });
  }
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

// Update user (PATCH)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    type UpdateParams = Parameters<typeof clerkClient.users.updateUser>[1];
    const updateData: UpdateParams = req.body;
    
    const user = await clerkClient.users.updateUser(id, updateData);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({
      error: error?.message || "Failed to update user"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await clerkClient.users.deleteUser(id);
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: error?.message || "Failed to delete user"
    });
  }
});

export default router;
