"use client";
import { useEffect, useState, useMemo } from "react";
import api from "@/utils/api"; 
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Side_Seller_Dashboard from "@/components/sideSellerdashboard";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Loadingpage from "@/loadingpages/loadingpage";

// Tipagem fiel ao seu Sequelize Model
type Product = {
  product_id: string;
  product_image: string;
  product_name: string;
  product_description: string;
  product_price: number;
  product_stock: number;
};

type UserMetadata = {
  name?: string;
  avatar_url?: string;
};

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const router = useRouter();

  // Extração segura dos dados do usuário
  const user = useMemo(() => {
    if (!session?.user) return null;
    const metadata = session.user.metadata as UserMetadata;

    return {
      id: session.user.id,
      name: metadata?.name || "Usuário",
      picture: metadata?.avatar_url || null,
    };
  }, [session]);

  useEffect(() => {
    // Verificação de segurança: Só dispara a busca se o 'user' e 'user.id' existirem
    if (!user?.id) {
      if (!session) setLoading(true); // Mantém loading se a sessão ainda estiver carregando
      return;
    }

    async function fetchProducts() {
      setLoading(true);
      try {
        // Correção do erro de Build: Usando template literal seguro ou params
        const response = await api.get(`products`, {
          params: { seller_id: user?.id } // Forma mais limpa de passar query params
        });
        
        const data = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.products || []);
          
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos do vendedor:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [user?.id, session]); // Adicionado session como dependência

  if (!session) return <Loadingpage />;

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <header className="flex fixed w-full justify-between z-50 items-center p-4 bg-gray-800 shadow-md border-b border-gray-400">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/home")}
            className="text-gray-400 hover:text-white transition cursor-pointer"
          >
            <FiArrowLeft size={24} />
          </button>
          <div className="text-2xl font-bold pl-8">Korddyfire</div>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{user.name}</span>
            {user.picture ? (
              <Image
                src={user.picture}
                alt="Avatar"
                width={40}
                height={40}
                className="rounded-full border border-green-500"
              />
            ) : (
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        )}
      </header>

      <div className="flex w-full">
        <Side_Seller_Dashboard />

        <main className="flex-1 p-8 mt-20 ml-60">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-black text-green-500">Meus Produtos</h1>
            <button 
              onClick={() => router.push('/create_products')}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold transition"
            >
              + Novo Produto
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center mt-20 text-gray-400">Carregando seus produtos...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-800 rounded-3xl border border-dashed border-gray-600">
              <p className="text-gray-400 text-xl">Nenhum produto cadastrado.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <li
                  key={p.product_id}
                  className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:border-green-500/50 transition-all group"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={p.product_image || "/placeholder.jpg"}
                      fill
                      alt={p.product_name}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-bold truncate mb-1">{p.product_name}</h2>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">
                      {p.product_description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-500 font-black text-lg">
                        ${p.product_price}
                      </span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                        Estoque: {p.product_stock}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;