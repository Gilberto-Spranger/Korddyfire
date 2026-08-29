'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react' // Opcional: ícone de alerta

export default function NotFound() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Ícone de alerta */}
        <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto" />

        {/* Código de erro */}
        <h1 className="text-6xl font-extrabold text-red-500">404</h1>

        {/* Título e descrição */}
        <p className="text-2xl font-semibold">Página não encontrada</p>
        <p className="text-gray-300">
          A página que procuras pode ter sido removida, renomeada ou está temporariamente indisponível.
        </p>

        {/* Botão para voltar */}
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Voltar para o início
        </Link>
      </div>
    </main>
  )
}