"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RoleGate } from "@/components/role-gate";
import Loadingpage from "@/loadingpages/loadingpage";
import Header from "@/components/header";

export default function AdminDashboard() {
  const { session } = useAuth();
  const router = useRouter();

  if (!session) return <Loadingpage />;

  return (
    <RoleGate 
      allowedRoles={['admin']} 
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
          <h1 className="text-3xl font-bold">Acesso Restrito</h1>
          <p className="mt-4 text-gray-500">Esta área é exclusiva para administradores.</p>
          <button onClick={() => router.push('/home')} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">Voltar</button>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8 mt-20">
          <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-2">Usuários</h2>
              <p className="text-4xl font-bold text-blue-600">1,245</p>
              <p className="text-sm text-gray-500 mt-2">Total de usuários registrados</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-2">Vendas Ativas</h2>
              <p className="text-4xl font-bold text-green-600">892</p>
              <p className="text-sm text-gray-500 mt-2">Pedidos em andamento</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-2">Relatórios de Abuso</h2>
              <p className="text-4xl font-bold text-red-600">3</p>
              <p className="text-sm text-gray-500 mt-2">Requerem atenção</p>
            </div>
          </div>
        </main>
      </div>
    </RoleGate>
  );
}
