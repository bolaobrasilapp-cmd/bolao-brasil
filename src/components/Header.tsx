import React, { useState } from 'react';
import { Menu, UserCircle2, X, HelpCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSair = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setIsMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const irParaAjuda = () => {
    setIsMenuOpen(false);
    navigate('/ajuda');
  };

  return (
    <>
      <header className="bg-white text-brazil-blue p-4 sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Burger Menu Left */}
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} className="text-brazil-blue" />
          </motion.button>

          {/* Logo Center */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <img src="/bolaobrasil.png" alt="Bolão Brasil Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-2xl font-black">
              BOLÃO <span className="text-brazil-green">BRASIL</span>
            </h1>
          </div>

          {/* User / Pix Icon Right */}
          <div 
            className="flex items-center gap-2 relative cursor-pointer"
            onClick={() => navigate('/perfil')}
          >
            <motion.button whileTap={{ scale: 0.9 }}>
              <UserCircle2 size={30} className="text-brazil-blue opacity-80" />
            </motion.button>
            <div className="absolute -bottom-1 -right-2 bg-brazil-green text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm tracking-wider">
              PIX
            </div>
          </div>
        </div>
      </header>

      {/* Menu Lateral Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-3/4 max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-brazil-blue text-white">
                <div className="flex items-center gap-2">
                  <UserCircle2 size={32} />
                  <div>
                    <p className="font-bold text-sm">Menu Bolão</p>
                    <p className="text-[10px] text-brazil-yellow">100% Seguro</p>
                  </div>
                </div>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 py-4 flex flex-col gap-2 px-4">
                
                {/* Botão de Ajuda Linkado */}
                <button 
                  onClick={irParaAjuda}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium text-left transition-colors"
                >
                  <HelpCircle size={20} className="text-brazil-blue" /> Central de Ajuda
                </button>
                
                {/* Botão de Sair Funcional */}
                <button 
                  onClick={handleSair}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-red-500 font-medium text-left mt-auto transition-colors"
                >
                  <LogOut size={20} /> Sair da Conta
                </button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};