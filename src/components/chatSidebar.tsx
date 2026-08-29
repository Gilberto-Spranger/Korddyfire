"use client";
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function ChatSidebar({
  search, setSearch, profiles, setActiveChatUser, previousContacts, handleSearch, isOpen, setIsSidebarOpen, activeChatUserId
}: any) {
  const router = useRouter();

  const UserItem = ({ user, showStatus = false }: any) => (
    <div 
      onClick={() => { setActiveChatUser(user); setIsSidebarOpen(false); }} 
      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
        activeChatUserId === user.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200'
      }`}
    >
      <div className="relative flex-shrink-0 w-12 h-12">
        {user.picture_url ? (
          <Image src={user.picture_url} alt="" fill className="rounded-full object-cover" />
        ) : (
          <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.username?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        {showStatus && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate">@{user.username}</p>
        <p className={`text-xs truncate ${activeChatUserId === user.id ? 'text-blue-100' : 'text-gray-500'}`}>
          Clique para conversar
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed md:static inset-y-0 left-0 w-[280px] lg:w-[350px] bg-white dark:bg-gray-900 border-r dark:border-gray-800 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full p-4">
          
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => router.push('/home')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition dark:text-white">
              <FiArrowLeft size={24}/>
            </button>
            <h1 className="text-xl font-black dark:text-white">Mensagens</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden dark:text-white">
              <IoClose size={24} />
            </button>
          </div>

          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 transition-all text-sm"
              placeholder="Buscar pelo @username..."
            />
          </div>

          <button 
            onClick={handleSearch} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 mb-6"
          >
            Pesquisar Usuário
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-none">
            {profiles.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Resultados da Busca</p>
                {profiles.map((p: any) => <UserItem key={p.id} user={p} />)}
              </div>
            )}

            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Conversas Recentes</p>
              {previousContacts.length > 0 ? (
                previousContacts.map((c: any) => <UserItem key={c.id} user={c} showStatus />)
              ) : (
                <p className="text-xs text-center text-gray-500 mt-10">Nenhuma conversa recente encontrada.</p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}