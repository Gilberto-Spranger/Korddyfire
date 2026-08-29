'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import Sideprofile from '@/components/sideprofile';
import Loadingpage from '@/loadingpages/loadingpage';
import api from '@/utils/api';

interface UserData {
  username: string;
  name: string;
  email: string;
  nationality: string;
  phone: string;
  birthdate: string;
  gender: string;
  picture_url: string;
}

interface ApiError {
  response?: { data?: { error?: string } };
}

const Profile = () => {
  const router = useRouter();
  const { session } = useAuth();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    username: '',
    name: '',
    email: '',
    nationality: '',
    phone: '',
    birthdate: '',
    gender: '',
    picture_url: '',
  });

  const isApiError = (err: unknown): err is ApiError =>
    typeof err === 'object' && err !== null && 'response' in err;

  const fetchUserData = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await api.get(`users/user/`);

      const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
      };

      setUserData({
        username: response.data.username || '',
        name: response.data.name || '',
        email: response.data.email || '',
        nationality: response.data.nationality || '',
        phone: response.data.phone || '',
        birthdate: formatDate(response.data.birthdate),
        gender: response.data.gender || '',
        picture_url: response.data.picture_url || '',
      });
    } catch (err: unknown) {
      if (isApiError(err)) {
        console.error('Erro ao buscar perfil:', err.response?.data?.error);
      } else if (err instanceof Error) {
        console.error('Erro ao buscar perfil:', err.message);
      } else {
        console.error('Erro desconhecido ao buscar perfil:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session === null) return;
    if (!session) router.push('/signin');
  }, [session, router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (!session || loading) return <Loadingpage />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-gray-950 shadow-md py-3 px-6 flex items-center z-10">
        <button
          onClick={() => router.push('/home')}
          className="text-gray-400 hover:text-white transition cursor-pointer"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="ml-4 text-lg font-semibold">Profile</h1>
      </div>

      {/* Sidebar */}
      <Sideprofile />

      {/* Conteúdo */}
      <div className="ml-64 pt-20 px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Foto + Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
            {userData.picture_url ? (
              <Image
                src={userData.picture_url}
                alt="Profile"
                width={120}
                height={120}
                className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-blue-500"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-700 flex items-center justify-center rounded-full shadow-lg">
                <span className="text-gray-400">No Picture</span>
              </div>
            )}

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{userData.name || 'Sem Nome'}</h1>
              <p className="text-gray-400 text-lg mt-1">{userData.email}</p>
              <p className="text-gray-500 mt-2">
                {userData.username && `@${userData.username}`}
              </p>
            </div>
          </div>

          {/* Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField label="Username" value={userData.username} />
            <ProfileField label="Name" value={userData.name} />
            <ProfileField label="Email" value={userData.email} />
            <ProfileField label="Nationality" value={userData.nationality} />
            <ProfileField label="Phone" value={userData.phone} />
            <ProfileField label="Gender" value={userData.gender} />
            <ProfileField label="Birthdate" value={userData.birthdate} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de campo de perfil
const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-400 mb-1">{label}</label>
    <div className="w-full px-4 py-3 bg-gray-800 text-gray-100 border border-gray-600 rounded-lg shadow-sm">
      {value || '—'}
    </div>
  </div>
);

export default Profile;