'use client';

import { usePathname, useRouter } from 'next/navigation';

function Side_Seller_Dashboard() {
  const pathname = usePathname(); 
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', path: '/seller_dashboard' },
    { name: 'Sales', path: '/sales' },
    { name: 'Products', path: '/products' },
    { name: 'Create Products', path: '/create_products' },
    { name: 'Wallet', path: '/wallet' },
    { name: 'Cards', path: '/cards' },
    { name: 'Savings', path: '/savings' },
    { name: 'Transactions', path: '/transactions' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path); // Navega para a nova rota
  };

  return (
    <div className="w-60 bg-gray-800 pl-4 pt-2 h-screen mt-18 fixed">
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center gap-2 p-3 rounded-l-lg w-full cursor-pointer transition-colors ${
              pathname === item.path ? 'text-white bg-gray-900' : 'text-gray-400 hover:text-white'
            }`}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Side_Seller_Dashboard;

