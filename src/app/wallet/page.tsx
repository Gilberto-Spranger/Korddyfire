'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiArrowUpRight, FiSend, FiArrowLeft } from 'react-icons/fi';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import { BiMoneyWithdraw } from 'react-icons/bi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import api from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import Side_Seller_Dashboard from '@/components/sideSellerdashboard';
import Loadingpage from '@/loadingpages/loadingpage';

// Interfaces
interface Transaction {
  id: number;
  amount: number;
  created_at: string;
  type: string;
  status: 'pending' | 'completed' | 'failed';
}

interface User {
  id: string;
  name: string;
  picture: string | null;
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

// Main Component
const Wallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { session } = useAuth();
  const router = useRouter();

  // Extract user safely
  const user: User | null = useMemo(() => {
    if (!session?.user) return null;

    const { id, user_metadata } = session.user as {
      id: string;
      user_metadata?: { name?: string; avatar_url?: string };
    };

    return {
      id,
      name: user_metadata?.name || 'User',
      picture: user_metadata?.avatar_url || null,
    };
  }, [session]);

  // Fetch wallet data
  useEffect(() => {
    if (!user) return;

    const fetchWalletData = async () => {
      try {
        const response = await api.get(`/wallets?userId=${user.id}`);
        const data = response.data;
        setBalance(data.balance ?? 0);
        setTransactions(data.wallet_transactions ?? []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchWalletData();
  }, [user]);

  const handleNavigation = (path: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(path);
  };

  if (!session) return <Loadingpage />;

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <header className="flex fixed w-full justify-between z-50 items-center p-4 bg-gray-800 shadow-md border-b border-gray-400">
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
        <main className="flex-1 p-4 ml-60 mt-12">
          <section className="flex justify-between gap-2 mt-8">
            <motion.div className="w-130 bg-gray-800 p-4 rounded-xl">
              <h2 className="text-md text-gray-300">Available Amount</h2>
              <motion.p className="text-2xl font-semibold mt-2">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(balance)}
              </motion.p>
            </motion.div>

            <motion.div className="bg-gray-800 p-8 rounded-xl space-y-4 w-135">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="flex gap-4">
                <QuickActionButton
                  icon={<FiPlus />}
                  label="Top up"
                  onClick={() => handleNavigation('/addmoney')}
                />
                <QuickActionButton icon={<BiMoneyWithdraw />} label="Withdraw" />
              </div>
              <div className="flex gap-4">
                <QuickActionButton icon={<FiSend />} label="Send" />
                <QuickActionButton icon={<FiPlus />} label="Express" />
              </div>
              <div className="flex gap-4">
                <QuickActionButton
                  icon={<FiArrowUpRight />}
                  label="Pay"
                />
                <QuickActionButton
                  icon={<FiPlus />}
                  label="Visa"
                  onClick={() => handleNavigation('/visa')}
                />
              </div>
            </motion.div>
          </section>

          <div className="flex justify-end w-full mt-8">
            <div className="bg-gray-800 px-4 pt-4 rounded-lg shadow-lg w-135 max-h-100 overflow-hidden">
              <h2 className="text-xl font-semibold">Transactions</h2>
              <motion.div className="pt-4 pb-12 max-h-100 overflow-y-scroll scrollbar-none">
                {transactions.length === 0 ? (
                  <p className="text-gray-400">No transactions yet</p>
                ) : (
                  transactions.map((txn) => <TransactionItem key={txn.id} txn={txn} />)
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon, label, onClick }: QuickActionButtonProps) => (
  <button
    className="flex items-center gap-2 bg-green-500 hover:bg-green-700 p-3 rounded-lg w-full cursor-pointer"
    onClick={onClick}
  >
    {icon} {label}
  </button>
);

// Transaction Item Component
const TransactionItem = ({ txn }: { txn: Transaction }) => {
  const getStatusIcon = () => {
    switch (txn.status) {
      case 'completed':
        return <FaCheckCircle className="text-green-400" />;
      case 'pending':
        return <FaClock className="text-yellow-400" />;
      case 'failed':
        return <FaTimesCircle className="text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <motion.div className="flex justify-between items-center p-3 bg-gray-950 rounded-lg mb-2 cursor-pointer">
      <div>
        <span className="block font-semibold">{txn.type}</span>
        <span className="text-xs text-gray-400">
          {new Date(txn.created_at).toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className={txn.amount > 0 ? 'text-green-400' : 'text-red-400'}>
          {txn.amount > 0 ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
        </span>
      </div>
    </motion.div>
  );
};

export default Wallet;