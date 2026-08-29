'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUpload, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import PhoneInput from '@/components/phoneinput';
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
  response?: {
    data?: {
      error?: string;
    };
  };
}

const Edit_Profile = () => {
  const router = useRouter();
  const { session } = useAuth();

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
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

  // Type guard para erros da API
  const isApiError = (err: unknown): err is ApiError =>
    typeof err === 'object' && err !== null && 'response' in err;

  // Redireciona se não estiver logado
  useEffect(() => {
    if (session === null) return;
    if (!session) router.push('/signin');
  }, [session, router]);

  // Função de fetch de usuário encapsulada em useCallback
  const fetchUserData = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    try {
      const response = await api.get(`users/user`);

      const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
        console.error("Erro ao buscar perfil:", err.response?.data?.error);
      } else if (err instanceof Error) {
        console.error("Erro ao buscar perfil:", err.message);
      } else {
        console.error("Erro desconhecido ao buscar perfil:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 12);
    setUserData((prev) => ({ ...prev, username: value }));
  };

  const formatDateForAPI = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formattedData = {
        ...userData,
        birthdate: formatDateForAPI(userData.birthdate),
      };
      await api.put(`users/edit_profile`, formattedData);
      alert("Perfil atualizado com sucesso!");
      router.push('/user/profile');
    } catch (err: unknown) {
      if (isApiError(err)) {
        console.error("Erro ao atualizar perfil:", err.response?.data?.error);
      } else if (err instanceof Error) {
        console.error("Erro ao atualizar perfil:", err.message);
      } else {
        console.error("Erro desconhecido ao atualizar perfil:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Se o backend espera multipart/form-data, use formData diretamente:
      const response = await api.post("users/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUserData((prev) => ({
        ...prev,
        picture_url: response.data.picture_url || prev.picture_url,
      }));

      alert("Imagem de perfil atualizada com sucesso!");
    } catch (err: unknown) {
      if (isApiError(err)) {
        console.error("Erro ao fazer upload da imagem:", err.response?.data?.error);
      } else if (err instanceof Error) {
        console.error("Erro ao fazer upload da imagem:", err.message);
      } else {
        console.error("Erro desconhecido ao enviar a imagem:", err);
      }
      alert("Erro ao enviar a imagem.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemovePicture = async () => {
    if (!userData.picture_url || !session?.user?.id) return;

    const confirmRemove = confirm("Tem certeza que deseja remover a imagem de perfil?");
    if (!confirmRemove) return;

    setLoading(true);

    try {
      const path = userData.picture_url.split('users/uploads/')[1];
      if (!path) throw new Error("Caminho inválido da imagem.");

      await api.delete("users/upload/profile-picture", {
        data: { path },
        withCredentials: true,
      });

      await api.put(`users/edit_profile`, {
        ...userData,
        picture_url: '',
        birthdate: formatDateForAPI(userData.birthdate),
      });

      setUserData((prev) => ({ ...prev, picture_url: '' }));
      alert("Imagem de perfil removida com sucesso!");
    } catch (err: unknown) {
      if (isApiError(err)) {
        console.error("Erro ao remover imagem:", err.response?.data?.error);
      } else if (err instanceof Error) {
        console.error("Erro ao remover imagem:", err.message);
      } else {
        console.error("Erro desconhecido ao remover imagem:", err);
      }
      alert("Erro ao remover a imagem.");
    } finally {
      setLoading(false);
    }
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);

    setUserData((prev) => ({ ...prev, birthdate: value }));
  };

  if (!session) return <Loadingpage />;

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='fixed top-0 left-0 w-full bg-gray-950 shadow-md py-3 px-6 flex items-center z-10'>
        <button onClick={() => router.push('/home')} className='text-gray-400 hover:text-white transition cursor-pointer'>
          <FiArrowLeft size={24} />
        </button>
        <h1 className='ml-4 text-lg font-semibold'>Edit Profile</h1>
      </div>

      <Sideprofile />

      <div className="ml-64 pt-20 px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
            <div className='flex gap-8 items-center'>
              {userData.picture_url ? (
                <>
                  <Image
                    key={userData.picture_url}
                    src={userData.picture_url}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg border-2 border-blue-600"
                  />
                  <button
                    onClick={handleRemovePicture}
                    className="flex items-center cursor-pointer bg-gray-700 p-2 rounded-lg text-sm text-red-500 hover:underline"
                  >
                    <FiTrash2 className="mr-1" /> Remover Imagem
                  </button>
                </>
              ) : (
                <div className="w-32 h-32 bg-gray-600 flex items-center justify-center rounded-full shadow-lg">
                  <span className="text-gray-400">Sem Imagem</span>
                </div>
              )}
              <label className='bg-gray-700 p-2 rounded-lg flex items-center text-sm text-gray-300 cursor-pointer hover:text-white'>
                <FiUpload className='mr-2' /> Carregar Imagem
                <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
              </label>
            </div>
          </div>

          <div className="gap-6">
            <form
              className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="space-y-6 w-110">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleUsernameChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    disabled
                    className="w-full px-4 py-2 bg-gray-600 text-gray-400 border border-gray-500 rounded-lg cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Telefone</label>
                  <PhoneInput
                    name="phone"
                    value={userData.phone}
                    onChange={(value) => setUserData((prev) => ({ ...prev, phone: value }))}
                  />
                </div>

                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium text-gray-300">Data de Nascimento</label>
                  <input
                    type="text"
                    id="birthdate"
                    name="birthdate"
                    value={userData.birthdate}
                    onChange={handleBirthdateChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-6 w-110">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium text-gray-300">Nacionalidade</label>
                  <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    value={userData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm -mt-3 font-medium text-gray-300">Gênero</label>
                  <select
                    id="gender"
                    name="gender"
                    value={userData.gender}
                    onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-4 py-3 mt-1 mb-5 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  >
                    <option value="">Selecionar</option>
                    <option value="Masculine">Masculine</option>
                    <option value="Feminine">Feminine</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || imageUploading}
                  className="w-full cursor-pointer md:w-auto px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading || imageUploading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit_Profile;