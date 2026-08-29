"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Sideprofile from "@/components/sideprofile";
import { useAuth } from "@/hooks/useAuth";
import Loadingpage from "@/loadingpages/loadingpage";
import api from "@/utils/api";

const DeleteAccount = () => {
  const router = useRouter();
  const { session, logout } = useAuth();

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Handle delete account – sempre chamado, não condicional
  const handleDeleteAccount = useCallback(async () => {
    if (!session?.user.id) {
      setError("Usuário não encontrado.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.delete("/delete_account", {
        data: { userId: session.user.id },
      });

      setSuccess("Conta excluída com sucesso.");
      await logout();

      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: unknown) {
      let message = "Ocorreu um erro ao excluir a conta.";

      if (err instanceof Error) {
        message = err.message;
      } else if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        message = (err as { response: { data: { message: string } } }).response.data.message;
      }

      setError(`Erro ao excluir a conta: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [session, logout, router]);

  // Se session não existir, renderiza loading, mas hooks já foram chamados
  if (!session) return <Loadingpage />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Cabeçalho */}
      <div className="p-4">
        <button
          onClick={() => router.push("/home")}
          className="text-gray-400 hover:text-white transition cursor-pointer flex items-center gap-2"
          aria-label="Voltar para página inicial"
        >
          <FiArrowLeft size={20} />
          Voltar
        </button>
      </div>

      <Sideprofile />

      <div className="ml-36 pt-20 px-8 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded shadow-md bg-gray-800">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Confirm Account Deletion
          </h2>

          {error && (
            <div className="bg-red-500 text-white p-3 mb-4 rounded-md text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 text-white p-3 mb-4 rounded-md text-center">
              {success}
            </div>
          )}

          <p className="text-center mb-6 text-gray-300">
            Are you sure you want to permanently delete your account? This
            action cannot be undone.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Deleting..." : "Delete Account"}
            </button>
            <button
              onClick={() => router.push("/home")}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;