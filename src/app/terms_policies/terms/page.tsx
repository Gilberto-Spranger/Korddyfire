"use client";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-6 py-12 md:py-20">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-green-400">
          Termos de Uso - Korddyfire
        </h1>

        <p className="text-gray-300 mb-6 text-lg md:text-xl leading-relaxed">
          Ao acessar e utilizar a plataforma <span className="font-semibold text-green-400">Korddyfire</span>, você concorda com os termos e condições descritos abaixo. Leia atentamente antes de prosseguir.
        </p>

        {/* Seção 1 */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-10 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-400">1. Uso da Plataforma</h2>
          <p className="text-gray-300 mb-2">
            Você não pode usar nossos serviços para atividades ilegais, fraudulentas ou que violem direitos de terceiros.
          </p>
        </div>

        {/* Seção 2 */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-10 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-400">2. Limitação de Responsabilidade</h2>
          <p className="text-gray-300 mb-2">
            A empresa não se responsabiliza por interrupções técnicas, perda de dados ou qualquer consequência de uso inadequado da plataforma.
          </p>
        </div>

        {/* Seção 3 */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-10 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-400">3. Alterações nos Termos</h2>
          <p className="text-gray-300 mb-2">
            Reservamo-nos o direito de alterar estes termos a qualquer momento. Recomendamos revisar periodicamente para manter-se atualizado.
          </p>
        </div>

        {/* Botão voltar */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-green-400 text-gray-950 font-semibold rounded-xl hover:bg-green-500 transition-colors shadow-md"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}