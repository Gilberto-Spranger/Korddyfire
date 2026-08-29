"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub, FaLock } from "react-icons/fa";
import api from "@/utils/api";
import Input from "@/components/ui/input";
import BackgroundImage from "@/components/backgroundimage";
import Loadingconnection from "@/loadingpages/loadingconnection";
import type { AxiosError } from "axios";
import type { User } from "@/types/types";

// ------------------
// Interfaces & Types
// ------------------

interface AuthSuccessResponse {
  token: string;
  message: string;
  user: User;
}

interface BackendErrorResponse {
  error?: string;
  detail?: string;
  message?: string;
}

type FormData = {
  email: string;
  password: string;
};

type Provider = "google" | "facebook" | "github" | "imlinkey";

// ------------------
// Helpers
// ------------------

const setCookie = (name: string, value: string, hours = 24) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )};expires=${expires.toUTCString()};path=/;Secure;SameSite=None`;
};

// ------------------
// Component
// ------------------

export default function Signin() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Verifica conexão online/offline
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    
    // Check inicial
    updateOnlineStatus();

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Atualiza inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // ---- Login: Email / Senha ----
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);

    try {
      const { data } = await api.post<AuthSuccessResponse>(
        "/auth/signin",
        formData
      );

      // Grava token no cookie e usuário no localStorage
      setCookie("auth_token", data.token, 2);
      
      if (data.user) {
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      // Redirecionamento
      router.replace("/home");
      
    } catch (err) {
      const axiosErr = err as AxiosError<BackendErrorResponse>;
      const msg =
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.detail ||
        axiosErr.response?.data?.message ||
        `Erro ao fazer login: ${err instanceof Error ? err.message : "Erro desconhecido"}`;
      
      setError(msg);
    } finally {
      setLoadingEmail(false);
    }
  };

  // ---- Login: OAuth ----
  const handleOAuthLogin = async (provider: Provider) => {
    setError(null);
    setLoadingProvider(provider);

    try {
      const res = await api.get<{ redirect_url?: string }>(`/auth/signin-${provider}/`);
      
      if (res.data?.redirect_url) {
        window.location.href = res.data.redirect_url;
      } else {
        throw new Error("Resposta inválida do servidor. URL de redirecionamento não encontrada.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao iniciar OAuth.");
      setLoadingProvider(null);
    }
  };

  if (!isOnline) return <Loadingconnection />;

  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Lado esquerdo (Imagem de fundo) */}
      <div className="hidden md:flex md:w-1/2 h-full">
        <BackgroundImage />
      </div>

      {/* Lado direito (Formulário) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-950 p-6">
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md flex flex-col justify-center items-center bg-gray-950 p-6 md:p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Sign In
          </h2>

          {/* Form email/senha */}
          <form className="w-full" onSubmit={handleSignIn} noValidate>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              className="w-full mb-3"
              required
            />
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              eye
              icon={<FaLock />}
              className="w-full mb-3"
              required
            />

            <div className="flex flex-col space-y-4 mt-4">
              <p className="text-white text-xs text-right">
                Esqueceu a senha?
                <Link
                  href="/user/recover_password"
                  className="text-blue-400 hover:text-blue-600 ml-2"
                >
                  Recuperar
                </Link>
              </p>

              <button
                type="submit"
                disabled={loadingEmail || !!loadingProvider}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 w-full rounded focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-busy={loadingEmail}
              >
                {loadingEmail ? "Carregando..." : "Entrar"}
              </button>
            </div>
          </form>

          {error && (
            <p role="alert" className="text-red-500 text-sm mt-2 text-center">
              {error}
            </p>
          )}

          {/* Criar conta */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Não tem uma conta?
            <Link href="/signup" className="text-blue-400 hover:text-blue-600 ml-2">
              Criar conta
            </Link>
          </p>

          {/* OAuth Buttons */}
          <div className="flex flex-col items-center mt-4 mb-10">
            <p className="text-gray-600 text-sm mb-2">Ou entre com</p>
            <div className="flex space-x-6">
              {/* Google */}
              <button
                onClick={() => handleOAuthLogin("google")}
                title="Entrar com Google"
                disabled={loadingEmail || loadingProvider !== null}
                aria-busy={loadingProvider === "google"}
                className="focus:outline-none hover:scale-110 transition-transform disabled:opacity-50"
              >
                <FcGoogle size={30} />
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleOAuthLogin("facebook")}
                title="Entrar com Facebook"
                disabled={loadingEmail || loadingProvider !== null}
                aria-busy={loadingProvider === "facebook"}
                className="focus:outline-none hover:scale-110 transition-transform disabled:opacity-50"
              >
                <FaFacebook size={30} className="text-blue-600" />
              </button>

              {/* Github */}
              <button
                onClick={() => handleOAuthLogin("github")}
                title="Entrar com GitHub"
                disabled={loadingEmail || loadingProvider !== null}
                aria-busy={loadingProvider === "github"}
                className="focus:outline-none hover:scale-110 transition-transform disabled:opacity-50"
              >
                <FaGithub size={30} className="text-white" />
              </button>

              {/* Imlinkey */}
              <button
                onClick={() => handleOAuthLogin("imlinkey")}
                className="relative w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-gray-800 hover:bg-gray-700 focus:outline-none hover:scale-110 transition-transform disabled:opacity-50"
                title="Entrar com Imlinkedy"
                disabled={loadingEmail || loadingProvider !== null}
                // CORRIGIDO: Era "imlinkedy", agora corresponde ao tipo "imlinkey"
                aria-busy={loadingProvider === "imlinkey"}
              >
                <Image
                  src="https://imlinkey.store/favicon.png"
                  alt="Imlinkey"
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </button>
            </div>
          </div>

          {/* --- From Korddy Section --- */}
          <div className="mt-6 text-center space-y-3 w-full">
            <p className="text-gray-400 text-sm">From Korddy</p>

            <div className="flex justify-center gap-3 flex-wrap">
              {/* Korddy Fire (imagem local) */}
              <button
                type="button"
                onClick={() => window.open("https://korddyfire.imlinkey.store", "_blank")}
                className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-300 hover:bg-gray-100 transition shadow-sm bg-white"
              >
                <Image
                  src="/favicon.png"
                  alt="Korddy Fire"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </button>

              {/* Imlinkey (imagem via link) */}
              <button
                type="button"
                onClick={() => window.open("https://imlinkey.store", "_blank")}
                className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-300 hover:bg-gray-100 transition shadow-sm bg-white"
              >
                <Image
                  src="https://imlinkey.store/favicon.png"
                  alt="Imlinkey"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}