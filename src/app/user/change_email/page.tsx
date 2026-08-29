"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { FiArrowLeft } from "react-icons/fi";
import Sideprofile from "@/components/sideprofile";
import Loadingpage from "@/loadingpages/loadingpage";

const ChangeEmail = () => {
  const router = useRouter();

  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [session] = useState<boolean>(true); // simula sessão

  // Busca email do usuário via API
  useEffect(() => {
    const fetchUserEmail = async () => {
      setLoading(true);
      try {
        const res = await api.get<{ email: string }>("/auth/me"); // tipagem explícita
        setCurrentEmail(res.data.email);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { error?: string } } })?.response?.data
            ?.error || "Erro ao obter o e-mail do usuário.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEmail();
  }, []);

  const sendOtp = async () => {
    setError("");
    setSuccess("");
    if (!newEmail) {
      setError("Digite o novo e-mail.");
      return;
    }
    try {
      await api.post("/auth/send-email-change-otp", { newEmail });
      setOtpSent(true);
      setSuccess("Código OTP enviado para o novo e-mail.");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Erro ao enviar código OTP.";
      setError(message);
    }
  };

  const verifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!otp) {
      setError("Digite o código OTP.");
      return;
    }
    try {
      await api.post("/auth/verify-email-change", { newEmail, otp });
      setSuccess("E-mail atualizado com sucesso! Faça login novamente.");
      setNewEmail("");
      setOtp("");
      await api.post("/auth/logout");
      router.push("/signin");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Erro ao validar OTP.";
      setError(message);
    }
  };

  if (!session) {
    return <Loadingpage />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Cabeçalho */}
      <div className="fixed top-0 left-0 w-full bg-gray-950 shadow-md py-3 px-6 flex items-center z-10">
        <button
          onClick={() => router.push("/home")}
          className="text-gray-400 hover:text-white transition cursor-pointer"
          aria-label="Voltar para página inicial"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="ml-4 text-lg font-semibold">Alterar E-mail</h1>
      </div>

      <Sideprofile />

      {/* Conteúdo */}
      <div className="ml-140 pt-20 px-8 pb-16 items-center justify-center">
        <div className="w-full max-w-md p-8 rounded shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-center">Alterar E-mail</h1>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mb-4 text-sm text-green-500">{success}</p>}

          {loading ? (
            <p className="text-center text-gray-500">Carregando...</p>
          ) : (
            <form onSubmit={otpSent ? verifyOtp : sendOtp}>
              <div className="mb-4">
                <label htmlFor="currentEmail" className="block mb-1 text-sm">
                  E-mail Atual
                </label>
                <input
                  id="currentEmail"
                  name="currentEmail"
                  value={currentEmail}
                  disabled
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="newEmail" className="block mb-1 text-sm">
                  Novo E-mail
                </label>
                <input
                  id="newEmail"
                  name="newEmail"
                  type="email"
                  placeholder="Digite o novo e-mail"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {otpSent && (
                <div className="mb-4">
                  <label htmlFor="otp" className="block mb-1 text-sm">
                    Código OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Digite o código OTP"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              )}

              {!otpSent ? (
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  Enviar Código OTP
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  Verificar OTP e Alterar E-mail
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeEmail;