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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {search ? `Search results for "${search}"` : 
             category && category !== 'all' ? 
             `${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}` : 
             'All Products'}
          </h1>
          <p className="text-gray-600">
            Discover premium tech products designed for the future
          </p>
        </div>
        
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
