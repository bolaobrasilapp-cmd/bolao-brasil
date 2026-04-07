import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Trophy, List, Wallet, User } from 'lucide-react';
import { Header } from '../components/Header';
import { SocialProof } from '../components/SocialProof'; // Nova importação

export const MainLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: List, label: 'Palpites', path: '/palpites' },
    { icon: Trophy, label: 'Rankings', path: '/rankings' },
    { icon: Wallet, label: 'Pix', path: '/pix' },
    { icon: User, label: 'Perfil', path: '/perfil' },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-xl relative">
      {/* Cabeçalho Oficial Unificado */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        <Outlet />
      </main>
{/* Popup de Prova Social Estilo Velo Delivery */}
      <SocialProof />
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                isActive ? 'text-brazil-green' : 'text-gray-400'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};