import { Router, Request, Response } from "express";
import { searchExternalProducts, getExternalProductDetails } from "../utils/externalProductApi";
import { shouldBeAdmin } from "../middleware/authMiddleware";

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
 * GET /external-products/details/:source/:productId
 * 
 * Get detailed product info from a specific external API.
 * Used after search to get full product details before import.
 */
router.get("/details/:source/:productId", shouldBeAdmin, async (req: Request, res: Response) => {
  try {
    const { source, productId } = req.params;
    
    if (!source || !['techspecs', 'fakestore', 'dummyjson'].includes(source)) {
      return res.status(400).json({ 
        error: "Invalid source. Must be 'techspecs', 'dummyjson', or 'fakestore'" 
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
