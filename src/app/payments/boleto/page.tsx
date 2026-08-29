"use client";

import { useState } from "react";

export default function BoletoPaymentPage() {
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");

  const handleGenerateBoleto = () => {
    alert("Boleto gerado com sucesso!");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Pagamento por Referência (Boleto)</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome Completo"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="CPF"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />

          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleGenerateBoleto}
          >
            Gerar Boleto
          </button>
        </div>
      </div>
    </div>
  );
}
