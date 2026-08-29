"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import Input from "@/components/ui/input";
import { FiArrowLeft } from "react-icons/fi";
import Sideprofile from "@/components/sideprofile";
import Loadingpage from "@/loadingpages/loadingpage";
import { useAuth } from "@/hooks/useAuth";

interface AppMetadata {
  providers?: string[];
}

interface UserSession {
  email?: string;
  app_metadata?: AppMetadata;
}

interface ApiError {
  response?: { data?: { message?: string } };
}

const ChangePassword = () => {
  const router = useRouter();
  const { session } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSocialLogin, setIsSocialLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!session?.user) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    const user: UserSession = session.user;
    setEmail(user.email || "");

    const socialProviders = ["google", "facebook", "github"];
    const providers = user.app_metadata?.providers ?? [];
    const hasSocialLogin = providers.some((provider) =>
      socialProviders.includes(provider)
    );
    setIsSocialLogin(hasSocialLogin);

    setLoading(false);
  }, [session]);

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (newPassword !== confirmPassword) {
      setError("A nova senha e a confirmação não correspondem.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (!isSocialLogin) {
        await api.post("/auth/validate-password", { email, password: currentPassword });
      }

      await api.post("/auth/change-password", { email, newPassword });

      setSuccess(
        isSocialLogin
          ? "Senha definida com sucesso! Faça login novamente."
          : "Senha atualizada com sucesso! Faça login novamente."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      await api.post("/auth/logout");
      router.push("/signin");
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || "Ocorreu um erro inesperado.");
      setIsSubmitting(false);
    }
  };

  if (!session || loading) return <Loadingpage />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="fixed top-0 left-0 w-full bg-gray-950 shadow-md py-3 px-6 flex items-center z-10">
        <button onClick={() => router.push("/home")} className="text-gray-400 hover:text-white">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="ml-4 text-lg font-semibold">Change Password</h1>
      </div>

      <Sideprofile />

      <div className="ml-140 pt-20 px-8 pb-16 items-center justify-center">
        <div className="w-full max-w-md p-8 rounded shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-center">
            {isSocialLogin ? "Set Password" : "Change Password"}
          </h1>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mb-4 text-sm text-green-500">{success}</p>}

          <form onSubmit={handleChangePassword}>
            {!isSocialLogin && (
              <div className="mb-4">
                <Input
                  name="currentPassword"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <Input
                name="newPassword"
                placeholder="Create a password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <Input
                name="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              disabled={isSubmitting}
            >
              {isSocialLogin ? "Set Password" : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;