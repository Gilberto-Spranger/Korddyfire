"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import Loadingpage from "@/loadingpages/loadingpage";
import { FiArrowLeft } from "react-icons/fi";
import Sideprofile from "@/components/sideprofile";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isAxiosError } from "axios";

const ChangePhone = () => {
  const router = useRouter();
  const { session } = useAuth();

  const [currentPhone, setCurrentPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (!session) return;
    setCurrentPhone(session.user.phone || "");
    setLoading(false);
  }, [session]);

  if (!session || loading) return <Loadingpage />;

  const sendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPhone || !isValidPhoneNumber(currentPhone)) {
      setError("Por favor, insira um número de telefone válido.");
      return;
    }

    try {
      await api.post("/user/phone/send-otp", { phone: currentPhone });
      setOtpSent(true);
      setSuccess("Código OTP enviado para o número de telefone.");
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        setError(e.response?.data?.error || "Erro ao enviar código OTP.");
      } else {
        setError("Erro ao enviar código OTP.");
      }
    }
  };

  const verifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Por favor, insira o código OTP.");
      return;
    }

    try {
      await api.post("/user/phone/verify-otp", { phone: currentPhone, otp });
      setSuccess("Número de telefone atualizado com sucesso! Faça login novamente.");
      setOtp("");
      await api.post("/auth/logout");
      router.push("/signin");
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        setError(e.response?.data?.error || "Erro ao verificar OTP.");
      } else {
        setError("Erro ao verificar OTP.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-gray-950 shadow-md py-3 px-6 flex items-center z-10">
        <button
          onClick={() => router.push("/home")}
          className="text-gray-400 hover:text-white transition cursor-pointer"
          aria-label="Voltar para página inicial"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="ml-4 text-lg font-semibold">Alterar Telefone</h1>
      </div>

      <Sideprofile />

      {/* Conteúdo */}
      <div className="pt-20 px-8 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded shadow-md bg-gray-800">
          <h1 className="mb-6 text-2xl font-bold text-center">
            Alterar Número de Telefone
          </h1>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mb-4 text-sm text-green-500">{success}</p>}

          <form onSubmit={otpSent ? verifyOtp : sendOtp}>
            <PhoneInput
              defaultCountry="AO"
              value={currentPhone}
              onChange={(val) => setCurrentPhone(val || "")}
              className="mb-4 w-full"
            />

            {otpSent && (
              <input
                type="text"
                placeholder="Digite o código OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-white bg-gray-700 focus:outline-none mb-4"
                required
              />
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {otpSent ? "Verificar OTP e Alterar Telefone" : "Enviar Código OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePhone;