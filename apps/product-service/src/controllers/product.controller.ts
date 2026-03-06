import { Request, Response } from "express";
import { prisma, Prisma } from "@repo/product-db";
import { StripeProductType } from "@repo/types";

export const createProduct = async (req: Request, res: Response) => {
  const data: Prisma.ProductCreateInput = req.body;

  const { colors, images } = data;
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return res.status(400).json({ message: "Colors array is required!" });
  }

  if (!images || typeof images !== "object") {
    return res.status(400).json({ message: "Images object is required!" });
  }

  const missingColors = colors.filter((color) => !(color in images));

  if (missingColors.length > 0) {
    return res
      .status(400)
      .json({ message: "Missing images for colors!", missingColors });
  }

  const product = await prisma.product.create({ data });

  console.log(`Product created: ${product.id} - ${product.name}`);
  
  res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: Prisma.ProductUpdateInput = req.body;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const productId = Number(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(500).json({
      error: "Failed to update product",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  const productId = Number(id);
  
  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }

  const deletedProduct = await prisma.product.delete({
    where: { id: productId },
  });

  console.log(`Product deleted: ${productId}`);

  return res.status(200).json(deletedProduct);
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { sort, category, search, limit, brands, rating, priceMin, priceMax, batteryCapacity } = req.query;

  // Build order by clause
  const orderBy = (() => {
    switch (sort) {
      case "asc":
        return { price: Prisma.SortOrder.asc };
      case "desc":
        return { price: Prisma.SortOrder.desc };
      case "oldest":
        return { createdAt: Prisma.SortOrder.asc };
      default:
        return { createdAt: Prisma.SortOrder.desc };
    }
  })();

  // Build where clause with all filters - optimized for single query
  const where: Prisma.ProductWhereInput = {
    // Category filter
    ...(category && {
      category: {
        slug: category as string,
      },
    }),
    // Search filter
    ...(search && {
      name: {
        contains: search as string,
        mode: "insensitive",
      },
    }),
    // Price range filters
    ...(priceMin || priceMax
      ? {
          price: {
            ...(priceMin && { gte: Number(priceMin) }),
            ...(priceMax && { lte: Number(priceMax) }),
          },
        }
      : {}),
  };

  // Fetch products with optimized query - select only needed fields for better performance
  let products = await prisma.product.findMany({
    where,
    orderBy,
    take: limit ? Number(limit) : undefined,
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      colors: true,
      sizes: true,
      category: true,
      categorySlug: true,
      shortDescription: true,
      description: true, // Include for brand and battery filters
      stockQuantity: true,
      stockStatus: true,
      lowStockThreshold: true,
      soldCount: true,
      isHeroProduct: true,
      heroOrder: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Apply brand filter (client-side for now, as brand info is in name/description)
  if (brands) {
    const brandList = (brands as string).split(',').map(b => b.trim().toLowerCase());
    products = products.filter(product => 
      brandList.some(brand => 
        product.name.toLowerCase().includes(brand) ||
        product.description?.toLowerCase().includes(brand)
      )
    );
  }

  // Apply rating filter (client-side, assuming we'll add reviews later)
  if (rating && Number(rating) > 0) {
    // For now, keep all products. Add review filtering when reviews are implemented
    // const minRating = Number(rating);
    // products = products.filter(product => product.averageRating >= minRating);
  }

  // Apply battery capacity filter (client-side, checking description)
  if (batteryCapacity) {
    const capacities = (batteryCapacity as string).split(',');
    products = products.filter(product => {
      const desc = product.description?.toLowerCase() || '';
      return capacities.some(cap => {
        if (cap.includes('Up to 3000mAh')) {
          return /([0-9]{3,4})\s*mah/i.test(desc) && parseInt(desc.match(/([0-9]{3,4})\s*mah/i)?.[1] || '0') < 3000;
        } else if (cap.includes('3000-4000mAh')) {
          const match = desc.match(/([0-9]{3,4})\s*mah/i);
          const value = parseInt(match?.[1] || '0');
          return value >= 3000 && value < 4000;
        } else if (cap.includes('4000-5000mAh')) {
          const match = desc.match(/([0-9]{3,4})\s*mah/i);
          const value = parseInt(match?.[1] || '0');
          return value >= 4000 && value < 5000;
        } else if (cap.includes('5000mAh+')) {
          const match = desc.match(/([0-9]{3,4})\s*mah/i);
          const value = parseInt(match?.[1] || '0');
          return value >= 5000;
        }
        return false;
      });
    });
  }

  res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  const productId = Number(id);
  
  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(200).json(product);
};

export const getHeroProducts = async (req: Request, res: Response) => {
  try {
    const heroProducts = await prisma.product.findMany({
      where: {
        isHeroProduct: true,
      },
      orderBy: {
        heroOrder: 'asc',
      },
      take: 10, // Limit to 10 hero products
    });

    return res.status(200).json(heroProducts);
  } catch (error) {
    console.error('Error fetching hero products:', error);
    return res.status(500).json({ error: 'Failed to fetch hero products' });
  }
};
