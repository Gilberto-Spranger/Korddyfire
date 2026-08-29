"use client";
import { useRef, useEffect } from 'react';
import { IoSend, IoMenu } from 'react-icons/io5';
import Image from 'next/image';

export default function ChatArea({
  messages, newMessage, setNewMessage, activeChatUser, user, typing, handleSendMessage, loadingMessages, onOpenSidebar
}: any) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeChatUser) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-400 p-6 text-center">
       <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full mb-4 flex items-center justify-center">
         <IoSend size={30} className="rotate-[-20deg]" />
       </div>
       <h2 className="text-xl font-bold dark:text-white mb-2">Suas mensagens</h2>
       <p className="text-sm max-w-xs">Escolha um contato na lista ou pesquise por um novo usuário para começar.</p>
       <button onClick={onOpenSidebar} className="md:hidden mt-6 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold">
         Ver Contatos
       </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b dark:border-gray-800 flex items-center gap-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onOpenSidebar} className="md:hidden p-2 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-xl">
          <IoMenu size={20} />
        </button>
        <div className="relative w-10 h-10">
          <Image src={activeChatUser.picture_url || '/placeholder.jpg'} alt="" fill className="rounded-full object-cover border dark:border-gray-700" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full" />
        </div>
        <div>
          <h2 className="font-bold dark:text-white text-sm md:text-base leading-none">@{activeChatUser.username}</h2>
          <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {loadingMessages ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : (
          messages.map((msg: any) => {
            const isMe = msg.user_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] md:max-w-[70%] p-3.5 rounded-2xl shadow-sm ${
                  isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 dark:text-white rounded-tl-none'
                }`}>
                  <p className="text-sm md:text-base leading-relaxed">{msg.message}</p>
                  <span className={`text-[10px] block mt-1 opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={scroller} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-950 border-t dark:border-gray-800">
        <div className="flex items-center gap-2 max-w-5xl mx-auto bg-gray-100 dark:bg-gray-900 rounded-2xl p-1.5 focus-within:ring-2 ring-blue-500 transition-all">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite uma mensagem..."
            className="flex-1 bg-transparent outline-none px-3 text-sm dark:text-white h-10"
          />
          <button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
            className="bg-blue-600 p-3 rounded-xl text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <IoSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}