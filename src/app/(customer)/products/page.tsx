"use client"
import React, { useState, useReducer, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, ChefHat, Salad, Soup, Utensils, X, Plus, Minus, CreditCard, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { loadStripe } from '@stripe/stripe-js';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


let stripePromise: any = null;
const getStripePromise = () => {
  if (!stripePromise) {
    const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripePublicKey) {
      console.error("Stripe public key is not set. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file.");
      return null;
    }
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

// Reducer for managing cart state
const cartReducer = (state, action) => {
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
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Fast Food': return <ChefHat className="h-6 w-6 text-[#EFA765]" />;
    case 'Healthy Options': return <Salad className="h-6 w-6 text-[#EFA765]" />;
    case 'Main Courses': return <Utensils className="h-6 w-6 text-[#EFA765]" />;
    case 'Desserts': return <Soup className="h-6 w-6 text-[#EFA765]" />;
    default: return <Utensils className="h-6 w-6 text-[#EFA765]" />;
  }
};

// --- Product Page Component ---
const ProductsPage = ({ groupedProducts, handleAddToCart, filterName, setFilterName, sortOrder, setSortOrder, setCurrentPage, getCartItemCount, loading, error }: any) => (
  <div className="w-full">
    {/* Hero Section */}
    <div
      className="relative w-full h-[60vh] bg-cover bg-center flex items-center justify-center p-6 rounded-b-[40px] shadow-lg"
      style={{
        backgroundImage: `url('https://ik.imagekit.io/kxbn8thcbf/nextjs-uploads/4dafaab409cd3a3f43beca2c60f7fb66_paw9Z4AyV.jpg?updatedAt=1753742618775')`,
      }}
    >
      <div className="absolute inset-0 bg-black/60 rounded-b-[40px]"></div>
      <div className="relative z-10 text-center">
        <h2 className="text-5xl tracking-tight md:text-6xl drop-shadow-2xl yeseva-one">Our Products</h2>
        <p className="mt-4 text-lg md:text-xl font-medium drop-shadow-lg font-[Varela Round] text-white">Delicious food, made with love.</p>
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
        <Button variant="ghost" onClick={() => setCurrentPage('products')} className="text-[#EFA765] hover:cursor-pointer border border-[#EFA765]/10 hover:bg-[#EFA765]">Products</Button>
        <Button variant="ghost" onClick={() => setCurrentPage('cart')} className="relative text-[#EFA765] hover:cursor-pointer border border-[#EFA765]/10 hover:bg-[#EFA765]">
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
              {groupedProducts[category].map(product => (
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

// --- Cart Page Component ---
const CartPage = ({ cart, handleUpdateQuantity, handleRemoveItem, handleCheckout, getCartTotal, isLoading, setCurrentPage }: any) => (
  <div className="container mx-auto p-4 md:p-8">
    <h2 className="text-4xl font-extrabold tracking-tight mb-8 text-center text-[#EFA765] font-[Yeseve One]">
      Your Cart
    </h2>
    <div className="max-w-4xl mx-auto space-y-6">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#1D2B3F] rounded-xl shadow-inner">
          <ShoppingCart className="h-16 w-16 text-[#EFA765]/40 mb-4" />
          <p className="text-2xl font-semibold text-[#EFA765]/60 font-[Varela Round]">Your cart is empty.</p>
          <Button onClick={() => setCurrentPage('products')} className="mt-4 bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map(item => (
              <Card key={item.id} className="flex flex-col md:flex-row items-center justify-between p-4 shadow-sm rounded-xl bg-[#1D2B3F] text-[#EFA765]">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <CardTitle className="text-lg font-bold font-[Yeseve One]">{item.name}</CardTitle>
                    <CardDescription className="text-sm font-[Varela Round] text-[#EFA765] opacity-70">Price: ${item.price.toFixed(2)}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="border-[#EFA765]/40 text-[#EFA765]"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      className="border-[#EFA765]/40 text-[#EFA765]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item)} className="text-red-500 hover:text-red-700">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 rounded-xl shadow-lg bg-[#1D2B3F] text-[#EFA765]">
            <h3 className="text-2xl font-bold mb-4 border-b border-[#EFA765]/20 pb-2 font-[Yeseve One]">Order Summary</h3>
            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <span className="font-[Varela Round]">Total:</span>
              <span className="font-[Varela Round]">${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleCheckout}
                disabled={isLoading || cart.length === 0}
                className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full"
              >
                {isLoading ? (
                  <>
                    <CreditCard className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </>
                )}
              </Button>
              <Button
                onClick={() => setCurrentPage('products')}
                variant="outline"
                className="w-full border-[#EFA765] text-[#EFA765] hover:bg-[#EFA765]/10 transition-colors duration-300 rounded-full"
              >
                Continue Shopping
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  </div>
);

// --- Main App Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('products');
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [filterName, setFilterName] = useState('');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const idempotencyKeyRef = useRef(uuidv4());

  const router = useRouter();
  const { data: session} = useSession();

  // --- Data Fetching Effect with Axios ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/api/product');
        const data = response.data;

        const mappedProducts = data.map(item => ({
          id: item._id,
          name: item.name,
          price: item.price,
          category: item.category,
          image: item.imageSrc,
          discount: item.discount || false,
          isAvailable: item.isAvailable,
        }));
        setProducts(mappedProducts);
      } catch (e) {
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
    let filtered = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(filterName.toLowerCase());
      return nameMatch;
    });

    if (sortOrder === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    const groupedProducts = filtered.reduce((acc, product) => {
      acc[product.category] = acc[product.category] || [];
      acc[product.category].push(product);
      return acc;
    }, {});

    return groupedProducts;
  };

  const groupedProducts = getFilteredAndSortedProducts();

  const handleAddToCart = (product) => {
    if (!session) {
      toast.error('Please sign in to add products to your cart.');
      router.push('/sign-in');
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} added to your cart.`);
  };

  const handleUpdateQuantity = (product, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { ...product, quantity } });
  };

  const handleRemoveItem = (product) => {
    dispatch({ type: 'REMOVE_ITEM', payload: product });
  };

  // --- New Stripe Checkout Logic with sonner toast.promise ---
  const handleCheckout = () => {
    const stripePromise = getStripePromise();

    const promise = async () => {
      setIsLoading(true);
      if (!stripePromise) {
        throw new Error("Stripe failed to load.");
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe object not available.");
      }

      const response = await fetch("/api/stripe-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKeyRef.current,
        },
        cache: "no-cache",
        body: JSON.stringify(cart),
      });

      const data = await response.json();

      if (response.ok && data.sessionId) {
        stripe.redirectToCheckout({ sessionId: data.sessionId });
        return "Redirecting to checkout...";
      } else {
        throw new Error(data.message || "Failed to initiate checkout. Please try again.");
      }
    };

    toast.promise(promise(), {
      loading: "Initiating checkout...",
      success: (message) => {
        setIsLoading(false);
        return message;
      },
      error: (error) => {
        setIsLoading(false);
        return `An unexpected error occurred: ${error.message}`;
      },
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Yeseve+One&family=Varela+Round&display=swap');
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Yeseve One', serif;
        }
        body, p, span, label {
          font-family: 'Varela Round', sans-serif;
        }
      `}</style>
      <div className="min-h-screen bg-[#141F2D] font-[Varela Round] text-[#EFA765] flex flex-col">
        {/* Render the Toaster at the root of the app */}
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
            <CartPage
              cart={cart}
              handleUpdateQuantity={handleUpdateQuantity}
              handleRemoveItem={handleRemoveItem}
              handleCheckout={handleCheckout}
              getCartTotal={getCartTotal}
              isLoading={isLoading}
              setCurrentPage={setCurrentPage}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default App;


