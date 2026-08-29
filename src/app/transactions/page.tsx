'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Side_Seller_Dashboard from '@/components/sideSellerdashboard';
import { FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Loadingpage from '@/loadingpages/loadingpage';

// Tipagens para o usuário e sessão
interface UserMetadata {
  name?: string;
  avatar_url?: string;
}

interface SessionUser {
  id: string;
  user_metadata?: UserMetadata;
}

interface Session {
  user?: SessionUser;
}

const Transactions = () => {
  const { session } = useAuth() as { session: Session | null };
  const router = useRouter();

  const user = useMemo(() => {
    if (!session?.user) return null;
    const metadata = session.user.user_metadata;
    return {
      id: session.user.id,
      name: metadata?.name || 'User',
      picture: metadata?.avatar_url || null,
    };
  }, [session]);

  if (!session) {
    return <Loadingpage />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header fixo no topo */}
      <header className="flex fixed w-full z-50 items-center p-4 justify-between bg-gray-800 shadow-md border-b border-gray-400">
        <div className="flex items-center">
          <button
            onClick={() => router.push('/home')}
            className="text-gray-400 hover:text-white transition cursor-pointer"
          >
            <FiArrowLeft size={24} />
          </button>
          <div className="text-2xl font-bold pl-8">Korddyfire</div>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm">{user.name}</span>
            {user.picture && (
              <Image
                src={user.picture}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          </div>
        )}
      </header>

      <div className="flex w-full">
        <Side_Seller_Dashboard />

        {/* Main content */}
        <main className="flex-1 p-4 mt-20 ml-60">
          <h1 className="text-2xl font-semibold">Transactions</h1>
          {/* Aqui você pode adicionar a lista de transações */}
        </main>
      </div>
    </div>
  );
};

export default Transactions;