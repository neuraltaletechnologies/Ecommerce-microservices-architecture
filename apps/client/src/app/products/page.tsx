import ProductList from "@/components/ProductList";
import CategoryFilter from "@/components/CategoryFilter";
import CategoryFilterSheet from "@/components/CategoryFilterSheet";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string; sort: string; search: string }>;
}) => {
  const category = (await searchParams).category;
  const sort = (await searchParams).sort;
  const search = (await searchParams).search;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <CategoryFilterSheet />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-4">
              <CategoryFilter />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <ProductList
              category={category}
              sort={sort}
              search={search}
              params="products"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
