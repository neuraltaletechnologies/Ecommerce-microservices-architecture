import ProductList from "@/components/ProductList";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        
        {/* Products */}
        <ProductList
          category={category}
          sort={sort}
          search={search}
          params="products"
        />
      </div>
    </div>
  );
};

export default ProductsPage;
