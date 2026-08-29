"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import api from "@/utils/api";
import Loadingconnection from "@/loadingpages/loadingconnection";
import Loadingpage from "@/loadingpages/loadingpage";

export default function Home() {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [products, setProducts] = useState<
    { id: string; name: string; price: number; image?: string; stock: number }[]
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (session === null) return;
    if (session && pathname !== "/home") router.push("/home");
    else if (!session && pathname !== "/") router.push("/");
  }, [session, pathname, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const formatPrice = (price: number) => price.toLocaleString("en");

  if (!isOnline) return <Loadingconnection />;
  if (loading) return <Loadingpage />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 z-50 bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
          <h1 className="text-2xl font-bold">Korddyfire</h1>
          <nav className="flex gap-2">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-[64px] w-full bg-red-600 text-white text-center py-2 z-40">
          Sem conexão com a internet. Tentando reconectar...
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative flex flex-col justify-end bg-gray-800 rounded-2xl shadow-md overflow-hidden group"
              >
                <div className="relative w-full h-64">
                  <Image
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-2 bg-gray-900/70 backdrop-blur-sm">
                  <p className="text-green-600 font-bold text-xl">${formatPrice(product.price)},00</p>
                  <h4 className="font-semibold text-lg truncate">{product.name}</h4>
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center justify-center w-full rounded-md bg-green-600 px-4 py-2 text-white shadow-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 py-4 w-full">
        <div className="text-center text-gray-400 text-sm">
          &copy; 2025 Korddyfire. All rights reserved.
        </div>
      </footer>
    </div>
  );
}