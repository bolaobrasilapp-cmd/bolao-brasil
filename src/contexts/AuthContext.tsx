import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any;
  login: (telefone: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  // Quando o app abre, ele procura se já tem alguém salvo na memória
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('@BolaoBrasil:user');
    if (usuarioSalvo) {
      setUser(JSON.parse(usuarioSalvo));
    }
  }, []);

  // Função que o botão de Login vai chamar
  const login = (telefone: string) => {
    const novoUsuario = { telefone, logado: true };
    setUser(novoUsuario);
    localStorage.setItem('@BolaoBrasil:user', JSON.stringify(novoUsuario));
  };

  // Função que o botão Sair vai chamar
  const logout = () => {
    setUser(null);
    localStorage.removeItem('@BolaoBrasil:user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);