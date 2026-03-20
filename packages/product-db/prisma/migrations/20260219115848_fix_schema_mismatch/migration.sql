-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "discount" INTEGER DEFAULT 0,
    "sizes" TEXT[],
    "colors" TEXT[],
    "images" JSONB NOT NULL,
    "techHighlights" JSONB,
    "boxContents" JSONB,
    "productFeatures" JSONB,
    "technicalSpecs" JSONB,
    "certifications" JSONB,
    "isHeroProduct" BOOLEAN NOT NULL DEFAULT false,
    "heroOrder" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "stockStatus" TEXT NOT NULL DEFAULT 'in_stock',
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
    "soldCount" INTEGER NOT NULL DEFAULT 0,
    "brand" TEXT,
    "externalSource" TEXT,
    "externalId" TEXT,
    "externalRawData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categorySlug" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_brand_idx" ON "public"."Product"("brand");

-- CreateIndex
CREATE INDEX "Product_externalSource_idx" ON "public"."Product"("externalSource");

-- CreateIndex
CREATE INDEX "Product_isPublished_idx" ON "public"."Product"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "Product_externalSource_externalId_key" ON "public"."Product"("externalSource", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categorySlug_fkey" FOREIGN KEY ("categorySlug") REFERENCES "public"."Category"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
