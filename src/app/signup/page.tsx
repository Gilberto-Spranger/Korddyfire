"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackgroundImage from "@/components/backgroundimage";
import api from "@/utils/api";
import { isAxiosError } from "axios";
import { FaLock, FaUser } from "react-icons/fa";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, UserCircleIcon } from "lucide-react";

function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
    terms_and_policies: false,
  });

  const handleChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    const newValue = name === "username" ? value.slice(0, 12) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  },
  []
);

const handleSignup = useCallback(
  async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.terms_and_policies) {
      alert("Você deve aceitar os Termos de Uso e Política de Privacidade.");
      setLoading(false);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert("Por favor, insira um e-mail válido.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/signup", formData);
      alert(response.data.message || "Cadastro realizado com sucesso!");
      router.push("/signin");
    } catch (error) {
  if (isAxiosError(error)) {
    console.error("Resposta de erro completa:", error.response?.data);
    console.error("Status do erro:", error.response?.status);
    alert(
      `Erro de Signup: ${
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Erro desconhecido"
      }`
    );
  } else {
    console.error("Erro inesperado:", error);
    alert("Erro inesperado no signup.");
  }
} finally {
      setLoading(false);
    }
  },
  [formData, router]
);

  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Background só aparece em desktop */}
      <div className="hidden md:flex md:w-1/2 h-full">
        <BackgroundImage />
      </div>

      {/* Formulário */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-950 p-6">
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md flex flex-col justify-center items-center bg-gray-950 p-6 md:p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Create an account
          </h2>

          <form className="w-full" onSubmit={handleSignup}>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              icon={<FaUser />}
              value={formData.name}
              onChange={handleChange}
              className="w-full mb-3"
              required
            />

            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              icon={<UserCircleIcon />}
              value={formData.username}
              onChange={handleChange}
              className="w-full mb-3"
              required
            />

            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              icon={<Mail />}
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-3"
              required
            />

            <Input
              type="password"
              name="password"
              icon={<FaLock />}
              eye
              placeholder="Create your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mb-3"
              required
            />

            <div className="flex items-start space-x-2 mt-4">
              <input
                type="checkbox"
                id="terms_and_policies"
                name="terms_and_policies"
                checked={formData.terms_and_policies}
                onChange={handleChange}
                className="mt-1 cursor-pointer"
              />
              <label
                htmlFor="terms_and_policies"
                className="text-gray-400 text-sm"
              >
                By signing up, I agree to the{" "}
                <Link href="/terms_policies/terms" className="text-blue-500 hover:text-blue-800">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="/terms_policies/policies" className="text-blue-500 hover:text-blue-800">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <Button
              type="submit"
              className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-500 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;