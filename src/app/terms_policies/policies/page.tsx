"use client";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-6 py-12 md:py-20">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-green-400">
          Política de Privacidade - Korddyfire
        </h1>

        <p className="text-gray-300 mb-6 text-lg md:text-xl leading-relaxed">
          Sua privacidade é muito importante para nós. Esta política explica como coletamos, usamos e protegemos suas informações ao usar o app <span className="font-semibold text-green-400">Korddyfire</span>.
        </p>

        {/* Seção 1 */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-10 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-400">1. Coleta de Informações</h2>
          <p className="text-gray-300 mb-2">
            Coletamos informações como nome, email, dados de navegação e preferências do usuário para melhorar sua experiência.
          </p>
        </div>

        {/* Seção 2 */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-10 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-400">2. Uso das Informações</h2>
          <p className="text-gray-300 mb-2">
            As informações coletadas são utilizadas apenas para melhorar nossos serviços, personalizar conteúdo e enviar notificações relevantes.
          </p>
        </div>

        {/* Seção 3 */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-10 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-400">3. Compartilhamento de Dados</h2>
          <p className="text-gray-300 mb-2">
            Nunca compartilhamos seus dados com terceiros sem seu consentimento explícito, garantindo total privacidade.
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