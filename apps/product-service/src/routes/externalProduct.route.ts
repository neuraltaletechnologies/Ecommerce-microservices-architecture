import { Router, Request, Response } from "express";
import { searchExternalProducts, getExternalProductDetails } from "../utils/externalProductApi";
import { shouldBeAdmin } from "../middleware/authMiddleware";
import { prisma } from "@repo/product-db";

const router: Router = Router();

/**
 * GET /external-products/search?q=MacBook Pro 14
 * 
 * Search external product APIs (TechSpecs, DummyJSON, FakeStore) for product details.
 * Returns: { results: ExternalProductResult[], fromCache: boolean, rateLimited: boolean }
 * 
 * Admin only - used to import product details into our database.
 */
router.get("/search", shouldBeAdmin, async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ 
        error: "Search query must be at least 2 characters",
        results: [],
        fromCache: false,
        rateLimited: false,
      });
    }

    // Use user ID for rate limiting if available
    const clientId = (req as any).userId || req.ip || 'default';
    
    const { results, fromCache, rateLimited } = await searchExternalProducts(
      query.trim(),
      clientId
    );

    if (rateLimited) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please wait a minute before trying again.",
        results: [],
        fromCache: false,
        rateLimited: true,
      });
    }

    return res.status(200).json({
      query: query.trim(),
      results,
      resultCount: results.length,
      fromCache,
      rateLimited: false,
    });
  } catch (error) {
    console.error("External product search error:", error);
    return res.status(500).json({
      error: "Failed to search external products",
      results: [],
      fromCache: false,
      rateLimited: false,
    });
  }
});

/**
 * GET /external-products/check-duplicate?source=techspecs&externalId=12345
 * 
 * Check if a product from an external API has already been imported.
 * Returns: { exists: boolean, existingProduct?: Product }
 */
router.get("/check-duplicate", shouldBeAdmin, async (req: Request, res: Response) => {
  try {
    const { source, externalId, name } = req.query;
    
    if (!source || !externalId) {
      return res.status(400).json({ 
        error: "Both 'source' and 'externalId' are required" 
      });
    }

    // Check by external source and ID (exact match)
    const existingByExternalId = await prisma.product.findFirst({
      where: {
        externalSource: source as string,
        externalId: externalId as string,
      },
      select: {
        id: true,
        name: true,
        price: true,
        externalSource: true,
        externalId: true,
        createdAt: true,
      },
    });

    if (existingByExternalId) {
      return res.status(200).json({
        exists: true,
        matchType: "exact",
        existingProduct: existingByExternalId,
      });
    }

    // Also check by similar name (fuzzy match)
    if (name) {
      const existingByName = await prisma.product.findFirst({
        where: {
          name: {
            contains: name as string,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          price: true,
          externalSource: true,
          externalId: true,
          createdAt: true,
        },
      });

      if (existingByName) {
        return res.status(200).json({
          exists: true,
          matchType: "similar_name",
          existingProduct: existingByName,
        });
      }
    }

    return res.status(200).json({
      exists: false,
      matchType: null,
      existingProduct: null,
    });
  } catch (error) {
    console.error("Duplicate check error:", error);
    return res.status(500).json({ error: "Failed to check for duplicates" });
  }
});

/**
 * POST /external-products/import
 * 
 * Import a product from external API data with admin-set business fields.
 * Body: {
 *   externalProduct: ExternalProductResult,  // From search API
 *   businessData: { price, stockQuantity, discount, isPublished, categorySlug }
 * }
 */
router.post("/import", shouldBeAdmin, async (req: Request, res: Response) => {
  try {
    const { externalProduct, businessData } = req.body;

    if (!externalProduct || !businessData) {
      return res.status(400).json({ 
        error: "Both 'externalProduct' and 'businessData' are required" 
      });
    }

    const { price, stockQuantity, discount, isPublished, categorySlug, colors, sizes } = businessData;

    if (price === undefined || price === null || price <= 0) {
      return res.status(400).json({ error: "Valid price is required" });
    }

    if (stockQuantity === undefined || stockQuantity === null || stockQuantity < 0) {
      return res.status(400).json({ error: "Stock quantity must be 0 or more" });
    }

    if (!categorySlug) {
      return res.status(400).json({ error: "Category is required" });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { slug: true },
    });

    if (!existingCategory) {
      return res.status(400).json({ error: `Invalid category slug: ${categorySlug}` });
    }

    // Check for duplicates before import
    const existingProduct = await prisma.product.findFirst({
      where: {
        externalSource: externalProduct.source,
        externalId: externalProduct.id,
      },
    });

    if (existingProduct) {
      return res.status(409).json({
        error: "Product already imported",
        existingProduct: {
          id: existingProduct.id,
          name: existingProduct.name,
        },
      });
    }

    // Determine stock status based on quantity
    let stockStatus = "in_stock";
    if (stockQuantity === 0) {
      stockStatus = "out_of_stock";
    } else if (stockQuantity <= 10) {
      stockStatus = "limited_stock";
    }

    // Use provided colors/sizes or defaults
    const productColors = colors && colors.length > 0 ? colors : ["default"];
    const productSizes = sizes && sizes.length > 0 ? sizes : ["Standard"];

    // Build images object - use externalProduct images or placeholder
    const images: Record<string, string[]> = {};
    const imageUrls = externalProduct.images && externalProduct.images.length > 0
      ? externalProduct.images
      : ["https://via.placeholder.com/400x400?text=No+Image"];
    
    productColors.forEach((color: string) => {
      images[color] = imageUrls;
    });

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: externalProduct.name,
        shortDescription: externalProduct.description?.substring(0, 200) || externalProduct.name,
        description: externalProduct.description || externalProduct.name,
        price: Math.round(price), // Ensure integer (price in smallest currency unit)
        discount: discount || 0,
        colors: productColors,
        sizes: productSizes,
        images: images,
        technicalSpecs: externalProduct.technicalSpecs || null,
        brand: externalProduct.brand || null,
        externalSource: externalProduct.source,
        externalId: externalProduct.id,
        externalRawData: externalProduct, // Store original data for reference
        categorySlug: categorySlug,
        stockQuantity: stockQuantity,
        stockStatus: stockStatus,
        isPublished: isPublished ?? true,
        isHeroProduct: false,
      },
    });

    console.log(`Product imported from ${externalProduct.source}: ${product.id} - ${product.name}`);

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Product import error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to import product";
    return res.status(500).json({ error: errorMessage });
  }
});

/**
 * GET /external-products/details/:source/:productId
 * 
 * Get detailed product info from a specific external API.
 * Used after search to get full product details before import.
 */
router.get("/details/:source/:productId", shouldBeAdmin, async (req: Request, res: Response) => {
  try {
    const { source, productId } = req.params;
    
    if (!source || !['techspecs', 'fakestore', 'dummyjson', 'platzi'].includes(source)) {
      return res.status(400).json({ 
        error: "Invalid source. Must be 'techspecs', 'dummyjson', 'platzi', or 'fakestore'" 
      });
    }

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await getExternalProductDetails(
      source as 'techspecs' | 'fakestore' | 'dummyjson',
      productId
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("External product details error:", error);
    return res.status(500).json({ error: "Failed to fetch product details" });
  }
});

export default router;
