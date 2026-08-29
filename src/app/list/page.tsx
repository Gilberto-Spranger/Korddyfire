"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/utils/api"; 
import Header from "@/components/header";
import Image from "next/image";
import { Heart } from "lucide-react";
import Loadingpage from "@/loadingpages/loadingpage";

// Tipagem alinhada com seu Model Sequelize
interface Product {
  product_id: string;      // ID no banco é product_id
  product_name: string;    // Nome no banco é product_name
  product_price: number;
  product_description: string;
  product_image?: string;
  product_stock: number;
}

function List() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productNameQuery = searchParams.get("value"); // Valor vindo da URL

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [loadin, setLoadin] = useState<Record<string, boolean>>({});

  const handleBuyNow = (productId: string) => {
    setLoadin((prev) => ({ ...prev, [productId]: true }));
    // Redireciona para detalhes usando o product_id correto
    router.push(`/details?id=${productId}`);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    async function fetchProducts() {
      // Se não houver busca, não faz nada ou busca todos
      if (!productNameQuery) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        /**
         * AJUSTE DE ENDPOINT:
         * Removi o 'name_like'. No Sequelize, você deve tratar o filtro no Controller.
         * Enviamos apenas 'name' como parâmetro.
         */
        const response = await api.get('products', {
          params: { name: productNameQuery } 
        });

        // Verifique se o backend retorna o array direto ou dentro de um objeto
        const data = Array.isArray(response.data) ? response.data : response.data.products || [];
        setProducts(data);
      } catch (err) {
        setError("Erro ao buscar produtos.");
        console.error("Erro na API:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [productNameQuery]);

  if (loading) return <Loadingpage />;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-900 min-h-screen container mx-auto px-4 py-8 mt-16 max-w-full w-full">
      <Header />
      
      {products.length === 0 ? (
        <p className="text-white text-center mt-20">Nenhum produto encontrado para "{productNameQuery}".</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.product_id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <div className="relative w-full h-[250px]">
                <Image
                  src={product.product_image || "/placeholder.jpg"}
                  alt={product.product_name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => toggleFavorite(product.product_id)}
                  className="absolute top-2 right-2 p-2 bg-black/20 rounded-full hover:bg-black/40 transition"
                >
                  <Heart
                    size={22}
                    className={favorites[product.product_id] ? "fill-red-500 text-red-500" : "text-white"}
                  />
                </button>
                <span className={`absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                  product.product_stock > 0 ? "bg-green-600 text-white" : "bg-red-500 text-white"
                }`}>
                  {product.product_stock > 0 ? "Em Estoque" : "Esgotado"}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 gap-2">
                <h3 className="text-gray-900 font-bold text-lg truncate">{product.product_name}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 h-8">{product.product_description}</p>
                
                <p className="text-green-600 text-xl font-black mt-2">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.product_price)}
                </p>

                <button
                  className="mt-auto h-11 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition flex items-center justify-center disabled:opacity-50"
                  onClick={() => handleBuyNow(product.product_id)}
                  disabled={loadin[product.product_id]}
                >
                  {loadin[product.product_id] ? "Carregando..." : "Ver Detalhes"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ListPage() {
  return (
    <Suspense fallback={<Loadingpage />}>
      <List />
    </Suspense>
  );
}