"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import Header from "@/components/header";
import Loadingpage from "@/loadingpages/loadingpage";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

type Product = { id: string; name: string; description: string; image?: string; price: number; stock: number; };
type User = { id: string; name: string; username: string; email: string };

const getCookie = (name: string) =>
  document.cookie
    .split("; ")
    .find((c) => c.startsWith(name + "="))
    ?.split("=")[1];

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadin, setLoadin] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = getCookie("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (token && storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get("/products/products");
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error("Erro ao buscar dados", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFavorite = (id: string) => setFavorites(prev => ({ ...prev, [id]: !prev[id] }));

  const handleBuyNow = (productId: string) => {
    setLoadin(prev => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      router.push(`/details?id=${productId}`);
      setLoadin(prev => ({ ...prev, [productId]: false }));
    }, 800);
  };

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  if (loading) return <Loadingpage />;

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen w-full flex flex-col">
      <Header />
      
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Saudação Responsiva */}
        {user && (
          <div className="mb-8 animate-fade-in">
            <h2 className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300">
              Olá, <span className="font-bold text-green-600">{user.name}</span>! 👋
            </h2>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Featured Products
          </h3>
          <div className="h-1 w-20 bg-green-500 rounded-full md:hidden" />
        </header>

        {/* Grid Adaptativo: 1 col (mobile), 2 cols (tablet), 3-4 cols (desktop) */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map(product => (
            <div 
              key={product.id} 
              className="group bg-white dark:bg-gray-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full"
            >
              {/* Container da Imagem com Aspect Ratio fixo */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-3xl">
                <Image
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  priority
                />
                
                {/* Badge de Estoque */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    product.stock > 0 
                      ? "bg-green-500/80 text-white" 
                      : "bg-red-500/80 text-white"
                  }`}>
                    {product.stock > 0 ? "In Stock" : "Sold Out"}
                  </span>
                </div>

                {/* Botão Favorito */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
                >
                  <Heart 
                    size={20} 
                    className={`transition-all ${favorites[product.id] ? "fill-red-500 text-red-500 scale-110" : "text-white"}`} 
                  />
                </button>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-4 flex-1">
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1 uppercase tracking-widest">
                    {product.name}
                  </p>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                    {product.description}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  
                  <button
                    onClick={() => handleBuyNow(product.id)}
                    disabled={loadin[product.id] || product.stock <= 0}
                    className="h-11 px-6 bg-gray-900 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                  >
                    {loadin[product.id] ? (
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                      </span>
                    ) : "Buy Now"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} <span className="font-bold text-gray-900 dark:text-white">Korddyfire</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;