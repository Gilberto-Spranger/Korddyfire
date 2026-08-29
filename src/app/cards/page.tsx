"use client";

import { useState, useMemo } from "react"; import { useAuth } from "@/hooks/useAuth"; import Image from "next/image"; import Side_Seller_Dashboard from "@/components/sideSellerdashboard"; import api from '@/utils/api'; import { AxiosError } from "axios"; import { FiArrowLeft } from "react-icons/fi"; import { useRouter } from "next/navigation"; import Loadingpage from "@/loadingpages/loadingpage";

interface Card { last4: string; brand: string; created_at: string; cvv: string; }

export default function Cards() { const { session } = useAuth(); const [cards, setCards] = useState<Card[]>([]); const [showCvvIndex, setShowCvvIndex] = useState<number | null>(null); const [address, setAddress] = useState({ line1: '', city: '', country: '', postal_code: '', state: '' }); const [currency, setCurrency] = useState(''); const router = useRouter(); const [error, setError] = useState<string | null>(null);

const user = useMemo(() => {
  if (!session?.user) return null;

  // Força tipagem do metadata
  const metadata = session.user.metadata as {
    name?: string;
    avatar_url?: string;
    birthdate?: string;
    nationality?: string;
  };

  return {
    id: session.user.id,
    name: metadata.name || "User",
    picture: metadata.avatar_url || null,
    email: session.user.email,
    phone: session.user.phone,
    birthdate: metadata.birthdate,
    nationality: metadata.nationality,
    address: address,
    currency: currency,
  };
}, [session, address, currency]);

const handleRequestCard = async () => {
  try {
    const userId = user?.id;

    if (!userId) {
      setError("Usuário inválido ou não autenticado.");
      return;
    }

    const res = await api.post("/stripe/request-card", {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
      nationality: user.nationality,
      address: user.address,
      currency: user.currency,
    });

    setCards([res.data.card]); // ou `res.data.cards` conforme backend
    setError(null);
    alert("Cartão solicitado com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao solicitar cartão:", err);

    const axiosError = err as AxiosError<{ error?: { message?: string } }>;
    const apiError = axiosError.response?.data?.error;
    const errorMessage =
      apiError?.message || "Erro inesperado. Tente novamente mais tarde.";

    // Exibe o erro na UI
    setError(errorMessage);
  }
};

const handleShowCvv = (index: number) => {
  setShowCvvIndex(index);
  setTimeout(() => setShowCvvIndex(null), 4000);
};

if (!session) {
  return (
    <Loadingpage />
  );
}

return (
  <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
    <header className="flex fixed w-full justify-between z-50 items-center p-4 bg-gray-800 shadow-md border-b border-gray-400">
      <div className="flex items-center">
        <button onClick={() => router.push('/home')} className='text-gray-400 hover:text-white transition cursor-pointer'>
          <FiArrowLeft size={24} />
        </button>
        <div className="text-2xl font-bold pl-8">Korddyfire</div>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm">{user.name}</span>
          {user.picture && (
            <Image
              src={user.picture}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
        </div>
      )}
    </header>

    <div className="flex w-full">
      <Side_Seller_Dashboard />

      <main className="flex-1 mt-20 ml-60 px-8 py-6">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Solicitar Cartão da Empresa</h2>

          {/* Formulário para adicionar dados */}
          <div className="mb-4">
            <label className="block text-sm mb-1">Endereço</label>
            <input
              type="text"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Endereço"
            />
            <input
              type="text"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
              placeholder="Cidade"
            />
            <input
              type="text"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
              placeholder="País"
            />
            <input
              type="text"
              value={address.postal_code}
              onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
              className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
              placeholder="Código Postal"
            />
            <input
              type="text"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
              placeholder="Estado"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Moeda</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Ex: EUR"
            />
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <button
            onClick={handleRequestCard}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded text-white font-bold cursor-pointer"
          >
            Pedir Cartão GreekX
          </button>
        </section>

        {/* Card List */}
        <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="relative w-full h-56 rounded-xl bg-black overflow-hidden shadow-lg p-6 flex flex-col justify-between"
              style={{
                backgroundImage: `url('/card-texture.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex justify-between items-start">
                <div className="text-white text-lg font-bold">GreekX</div>
                <Image src="/favicon.svg" alt="logo" width={30} height={30} />
              </div>

              <div className="text-lg font-mono tracking-widest mt-6">
                •••• •••• •••• {card.last4}
              </div>

              <div className="flex justify-between mt-2">
                <div className="items-center gap-1">
                  <span className="text-gray-400 text-xxs">CVV</span>
                  <div className="items-center gap-2">
                    {showCvvIndex === index ? (
                      <span
                        onClick={() => setShowCvvIndex(null)}
                        className="cursor-pointer"
                      >
                        {card.cvv}
                      </span>
                    ) : (
                      <Image
                        src="/eyed.svg"
                        alt="Show CVV"
                        width={18}
                        height={18}
                        className="cursor-pointer opacity-70 hover:opacity-100 ml-1"
                        onClick={() => handleShowCvv(index)}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-xxs">Bandeira</span>
                  <div>{card.brand}</div>
                </div>
                <div>
                  <span className="text-gray-400 text-xxs">Criado em</span>
                  <div>{new Date(card.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  </div>
);

}

