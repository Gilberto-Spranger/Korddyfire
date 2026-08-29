"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/utils/api";
import Header from "@/components/header";
import Image from "next/image";
import { Heart } from "lucide-react";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Loadingpage from "@/loadingpages/loadingpage";

interface ProductData {
  product_id: string;
  seller_id: string;
  product_name: string;
  product_price: number;
  product_description: string;
  product_image?: string;
  product_stock: number;
}

function Details() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const { session } = useAuth();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;

      // REGEX para validar UUID: Impede que strings como 'wallets' cheguem ao banco
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      if (!uuidRegex.test(productId)) {
        console.error("ID inválido fornecido:", productId);
        setError("Produto não encontrado (ID inválido).");
        return;
      }

      try {
        const response = await api.get(`products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        setError("Não foi possível carregar os detalhes do produto.");
      }
    }
    fetchProduct();
  }, [productId]);

  if (error) return <div className="text-white text-center mt-20">{error}</div>;
  if (!product || !session) return <Loadingpage />;

  return (
    <div className="bg-gray-900 min-h-screen container mx-auto px-4 py-8 mt-16 max-w-full w-full">
      <Header />
      <div className="flex flex-col md:flex-row bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
        <div className="relative w-full md:w-1/2 h-[400px] md:h-[500px]">
          <Image
            src={product.product_image || "/placeholder.jpg"}
            alt={product.product_name}
            fill
            className="object-cover"
            priority
          />
          <button
            onClick={() => setFavorites(prev => ({ ...prev, [product.product_id]: !prev[product.product_id] }))}
            className="absolute top-4 right-4 bg-black/40 p-2 rounded-full hover:bg-black/60 transition"
          >
            <Heart size={28} className={favorites[product.product_id] ? "fill-red-500 text-red-500" : "text-white"} />
          </button>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center w-full md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">{product.product_name}</h1>
          <p className="text-gray-400 text-lg mb-6 italic">"{product.product_description}"</p>
          <p className="text-4xl font-bold text-green-500 mb-8">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.product_price)}
          </p>
          <button
            className="w-full md:max-w-xs h-14 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-2xl transition-all disabled:opacity-50"
            onClick={async () => {
                // Lógica de compra...
            }}
            disabled={isBuying || product.product_stock <= 0}
          >
            {isBuying ? "Processando..." : "Comprar Agora"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loadingpage />}>
      <Details />
    </Suspense>
  );
}