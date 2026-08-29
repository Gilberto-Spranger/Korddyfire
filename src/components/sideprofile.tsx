'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaEdit,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaTrash,
} from 'react-icons/fa';

function Sideprofile() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Profile', path: '/user/profile', icon: <FaUser /> },
    { name: 'Edit Profile', path: '/user/edit_profile', icon: <FaEdit /> },
    { name: 'Change Password', path: '/user/change_password', icon: <FaLock /> },
    { name: 'Change Email', path: '/user/change_email', icon: <FaEnvelope /> },
    { name: 'Change Phone', path: '/user/change_phone', icon: <FaPhone /> },
    { name: 'Delete account', path: '/user/delete_account', icon: <FaTrash color='red'/> },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <motion.aside
      className="w-60 bg-gray-800 pl-4 pt-2 h-screen mt-13 fixed"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <nav className="space-y-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-3 p-3 rounded-l-lg w-full cursor-pointer transition-colors ${
                isActive
                  ? 'text-white bg-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </motion.aside>
  );
}

export default Sideprofile;
