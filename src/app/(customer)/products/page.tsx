"use client"
import React, { useState, useReducer, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, ChefHat, Salad, Soup, Utensils, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Import segregated components
import CheckoutPage from '@/components/checkout/CheckoutPage';


// Reducer for managing cart state
const cartReducer = (state: any[], action: any) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload.id);
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

// Helper function to get category icons
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Fast Food': return <ChefHat className="h-6 w-6 text-[#EFA765]" />;
    case 'Healthy Options': return <Salad className="h-6 w-6 text-[#EFA765]" />;
    case 'Main Courses': return <Utensils className="h-6 w-6 text-[#EFA765]" />;
    case 'Desserts': return <Soup className="h-6 w-6 text-[#EFA765]" />;
    default: return <Utensils className="h-6 w-6 text-[#EFA765]" />;
  }
};

const ProductsPage = ({ groupedProducts, handleAddToCart, filterName, setFilterName, sortOrder, setSortOrder, setCurrentPage, getCartItemCount, loading, error }: any) => (
  <div className="w-full">
    <div
      className="relative w-full h-[60vh] bg-cover bg-center flex items-center justify-center p-6 rounded-b-[40px] shadow-lg"
      style={{
        backgroundImage: `url('https://ik.imagekit.io/kxbn8thcbf/nextjs-uploads/4dafaab409cd3a3f43beca2c60f7fb66_paw9Z4AyV.jpg?updatedAt=1753742618775')`,
      }}
    >
      <div className="absolute inset-0 bg-black/60 rounded-b-[40px]"></div>
      <div className="relative z-10 text-center">
        <h2 className="text-5xl tracking-tight md:text-6xl yeseva-one">Our Products</h2>
        <p className="mt-4 text-lg md:text-xl font-medium yeseva-one">Delicious food, made with love.</p>
      </div>
    </div>

    {/* Filters and Sorting */}
    <div className="container mx-auto p-4 mt-8 flex flex-col md:flex-row items-center justify-evenly space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex w-full min-w-[60%] md:w-auto space-x-2">
        <Label htmlFor="search-name" className="w-[160px]">Search By Name :</Label>
        <Input
          id="search-name"
          type="text"
          placeholder="Filter by name..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="w-full rounded-full focus:ring-2 focus:ring-[#EFA765] transition-shadow text-white"
        />
      </div>
      <div className="flex w-full items-center text-gray-800">
        <Label htmlFor="sort-price" className="min-w-[150px] text-[#EFA765] mr-[-45px]">Sort by Price :</Label>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger id="sort-price" className="rounded-full w-full text-white">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Navigation buttons on the right */}
      <div className="flex items-center space-x-2 ml-4">
        <Button variant="ghost" onClick={() => setCurrentPage('products')} className="text-[#EFA765] hover:cursor-pointer border border-[#EFA765]/10 hover:bg-[#EFA765]/10 hover:text-[#EFA765]">Products</Button>
        <Button variant="ghost" onClick={() => setCurrentPage('cart')} className="relative text-[#EFA765] hover:cursor-pointer border border-[#EFA765]/10 hover:bg-[#EFA765]/10 hover:text-[#EFA765]">
          <ShoppingCart className="h-5 w-5" />
          {getCartItemCount() > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {getCartItemCount()}
            </span>
          )}
        </Button>
      </div>
    </div>

    {/* Loading/Error/Product Rows */}
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="flex justify-center items-center h-64 text-[#EFA765]">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p className="text-xl">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-xl h-64 flex justify-center items-center">
          <p>Error loading products: {error}</p>
        </div>
      ) : Object.keys(groupedProducts).length === 0 ? (
        <div className="text-center text-[#EFA765]/60 text-xl h-64 flex justify-center items-center">
            <p>No products found matching your criteria.</p>
        </div>
      ) : (
        Object.keys(groupedProducts).map(category => (
          <div key={category} className="my-10">
            <div className="flex items-center mb-6">
              {getCategoryIcon(category)}
              <h3 className="ml-3 text-3xl font-bold tracking-tight font-[Yeseve One] text-[#EFA765]">{category}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groupedProducts[category].map((product: any) => (
                <Card key={product.id} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl bg-[#1D2B3F] text-[#EFA765]">
                  <CardHeader className="p-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl font-bold font-[Yeseve One]">{product.name}</CardTitle>
                    <CardDescription className="mt-2 text-lg font-semibold text-[#EFA765] font-[Varela Round]">${product.price.toFixed(2)}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 flex items-center justify-between">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full hover:cursor-pointer"
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);


// --- Main App Component (app/page.tsx) ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('products');
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [filterName, setFilterName] = useState('');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const { data: session } = useSession();

  // --- Data Fetching Effect with Axios ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/api/product');
        const data = response.data;

        const mappedProducts = data.map((item: any) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          category: item.category,
          image: item.imageSrc,
          discount: item.discount || false,
          isAvailable: item.isAvailable,
        }));
        setProducts(mappedProducts);
      } catch (e: any) {
        console.error("Failed to fetch products:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    const filtered = products.filter((product: any) => {
      const nameMatch = product.name.toLowerCase().includes(filterName.toLowerCase());
      return nameMatch;
    });

    if (sortOrder === 'price-asc') {
      filtered.sort((a: any, b: any) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      filtered.sort((a: any, b: any) => b.price - a.price);
    }

    const groupedProducts = filtered.reduce((acc: any, product: any) => {
      acc[product.category] = acc[product.category] || [];
      acc[product.category].push(product);
      return acc;
    }, {});

    return groupedProducts;
  };

  const groupedProducts = getFilteredAndSortedProducts();

  const handleAddToCart = (product: any) => {
    if (!session) {
      toast.error('Please sign in to add products to your cart.');
      router.push('/sign-in');
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} added to your cart.`);
  };

  const handleUpdateQuantity = (product: any, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { ...product, quantity } });
  };

  const handleRemoveItem = (product: any) => {
    dispatch({ type: 'REMOVE_ITEM', payload: product });
  };

  const getOriginalCartTotal = () => {
    return cart.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count: number, item: any) => count + item.quantity, 0);
  };

  return (
    <>
      <div className="min-h-screen bg-[#141F2D] font-[Varela Round] text-[#EFA765] flex flex-col">
        <Toaster />
        <main className="flex-grow">
          {currentPage === 'products' && (
            <ProductsPage
              groupedProducts={groupedProducts}
              handleAddToCart={handleAddToCart}
              filterName={filterName}
              setFilterName={setFilterName}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              setCurrentPage={setCurrentPage}
              getCartItemCount={getCartItemCount}
              loading={loading}
              error={error}
            />
          )}

          {currentPage === 'cart' && (
            <CheckoutPage
              cart={cart}
              handleUpdateQuantity={handleUpdateQuantity}
              handleRemoveItem={handleRemoveItem}
              getOriginalCartTotal={getOriginalCartTotal}
              dispatch={dispatch}
              setCurrentPage={setCurrentPage}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default App;







// const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     `Date.now()` gives the current time in milliseconds. Subtracting the total milliseconds in 24 hours gives you the precise timestamp from one day ago.



//     const recentOrders = await Order.find({
//     createdAt: { $gte: twentyFourHoursAgo }
// }).sort({ createdAt: -1 });
//     * `$gte` stands for **Greater Than or Equal To**.
// * This query efficiently instructs MongoDB to return only documents where the `createdAt` value is **newer than or equal to** the cutoff time, effectively capturing all orders in the past 24 hours.
// * `.sort({ createdAt: -1 })` ensures the newest orders appear at the top.