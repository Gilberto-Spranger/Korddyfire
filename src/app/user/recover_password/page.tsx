"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/utils/api";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);

  const handleSendRecovery = async () => {
    if (!email) {
      setStatus("Please enter your email.");
      setErrorStatus(true);
      return;
    }

    setStatus("Sending...");
    setErrorStatus(false);

    try {
      await api.post("/auth/reset-password", { email });
      setStatus("Recovery email sent! Check your inbox.");
      setErrorStatus(false);
    } catch (err: unknown) {
      let message = "An unexpected error occurred.";

      if (err instanceof Error) {
        message = err.message;
      }

      if (err && typeof err === "object" && "response" in err) {
        const apiErr = err as ApiError;
        if (apiErr.response?.data?.message) {
          message = apiErr.response.data.message;
        }
      }

      setStatus(`Error: ${message}`);
      setErrorStatus(true);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-950 p-6">
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md flex flex-col justify-center items-center bg-gray-950 p-6 md:p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Recover Password</h2>

          {status && (
            <p className={`text-sm mb-4 ${errorStatus ? "text-red-500" : "text-green-400"}`}>
              {status}
            </p>
          )}

          <form className="w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="email" className="block text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSendRecovery}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 w-full rounded focus:outline-none focus:ring-2 transition-all"
            >
              Send Reset Link
            </button>
          </form>

          <Link href="/signin" className="mt-4 text-blue-400 hover:underline">
            Back to Signin
          </Link>
        </motion.div>
      </div>

      {/* Right side - Background */}
      <div
        className="hidden md:flex md:w-1/2 h-full bg-cover bg-center items-center justify-center text-white p-8"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/46/9a/f7/469af73674363bdd1c5431f02254ab39.jpg')",
        }}
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to Korddyfire</h1>
      </div>
    </div>
  );
}