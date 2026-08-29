"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import api, { ApiErrorResponse } from "@/utils/api";
import axios from "axios";
import Loadingpage from "@/loadingpages/loadingpage";
import { useAuth } from "@/hooks/useAuth";

export default function AddMoney() {
  const { session } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const userId = session?.user?.id;

  if (!session) return <Loadingpage />;

  const handleAddMoney = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      alert("Insira um valor válido.");
      return;
    }
    if (!userId) {
      alert("Usuário não autenticado.");
      return;
    }

    setLoading(true);

    try {
      // Busca carteira do usuário
      const { data: wallet } = await api.get(`/wallets/${userId}`);

      if (wallet) {
        // Atualiza saldo existente
        await api.put(`/wallets/${userId}`, {
          balance: wallet.balance + value,
        });
      } else {
        // Cria nova carteira
        await api.post(`/wallets`, {
          user_id: userId,
          balance: value,
        });
      }

      // Registra transação
      await api.post(`/wallet-transactions`, {
        user_id: userId,
        wallet_id: wallet?.id || null,
        amount: value,
        type: "deposit",
        status: "completed",
      });

      alert("Dinheiro adicionado com sucesso!");
      router.push("/wallet");
    } catch (err: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        alert(`Erro: ${err.response?.data?.error || "Tente novamente mais tarde."}`);
      } else {
        alert("Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <motion.div
        className="w-full max-w-2xl flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
          onClick={() => router.back()}
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold">Adicionar Dinheiro</h1>
      </motion.div>

      <motion.div
        className="mt-10 w-full max-w-lg p-6 bg-gray-800 rounded-xl shadow-lg text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-gray-400">Valor a adicionar</p>
        <p className="text-3xl font-bold text-green-400">${amount || "0.00"}</p>

        <input
          type="number"
          placeholder="Insira um valor"
          className="mt-4 w-full p-3 rounded-lg bg-gray-700 text-white text-center focus:outline-none focus:ring-2 focus:ring-green-500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
        />

        <button
          className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold transition disabled:opacity-50 w-full"
          onClick={handleAddMoney}
          disabled={loading}
        >
          {loading ? (
            "Processando..."
          ) : (
            <>
              <FiCheckCircle size={20} /> Confirmar
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}