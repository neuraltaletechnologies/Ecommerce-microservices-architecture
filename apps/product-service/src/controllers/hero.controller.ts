import { Request, Response } from "express";
import { prisma } from "@repo/product-db";

// Batch update hero products
export const batchUpdateHeroProducts = async (req: Request, res: Response) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: "Updates must be an array" });
    }

    // Validate updates
    for (const update of updates) {
      if (!update.id || typeof update.isHeroProduct !== "boolean") {
        return res.status(400).json({ 
          error: "Each update must have id and isHeroProduct fields" 
        });
      }
    }

    // Perform batch update
    const results = await Promise.all(
      updates.map((update) =>
        prisma.product.update({
          where: { id: update.id },
          data: {
            isHeroProduct: update.isHeroProduct,
            heroOrder: update.heroOrder || null,
          },
        })
      )
    );

    return res.status(200).json({
      message: "Products updated successfully",
      count: results.length,
      products: results,
    });
  } catch (error) {
    console.error("Error in batch update:", error);
    return res.status(500).json({ error: "Failed to batch update products" });
  }
};

// Reorder all hero products
export const reorderHeroProducts = async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds)) {
      return res.status(400).json({ error: "productIds must be an array" });
    }

    // Update order for each product
    const results = await Promise.all(
      productIds.map((id, index) =>
        prisma.product.update({
          where: { id },
          data: {
            heroOrder: index + 1,
          },
        })
      )
    );

    return res.status(200).json({
      message: "Hero products reordered successfully",
      products: results,
    });
  } catch (error) {
    console.error("Error reordering hero products:", error);
    return res.status(500).json({ error: "Failed to reorder hero products" });
  }
};

// Clear all hero products
export const clearAllHeroProducts = async (req: Request, res: Response) => {
  try {
    const result = await prisma.product.updateMany({
      where: { isHeroProduct: true },
      data: {
        isHeroProduct: false,
        heroOrder: null,
      },
    });

    return res.status(200).json({
      message: "All hero products cleared",
      count: result.count,
    });
  } catch (error) {
    console.error("Error clearing hero products:", error);
    return res.status(500).json({ error: "Failed to clear hero products" });
  }
};

// Get hero products stats
export const getHeroProductsStats = async (req: Request, res: Response) => {
  try {
    const heroCount = await prisma.product.count({
      where: { isHeroProduct: true },
    });

    const totalProducts = await prisma.product.count();

    const heroProducts = await prisma.product.findMany({
      where: { isHeroProduct: true },
      orderBy: { heroOrder: "asc" },
      select: {
        id: true,
        name: true,
        heroOrder: true,
        categorySlug: true,
      },
    });

    return res.status(200).json({
      totalProducts,
      heroCount,
      availableSlots: Math.max(0, 10 - heroCount),
      heroProducts,
    });
  } catch (error) {
    console.error("Error getting hero products stats:", error);
    return res.status(500).json({ error: "Failed to get stats" });
  }
};
