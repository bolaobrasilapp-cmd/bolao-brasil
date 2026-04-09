import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
  user: any;
  saldo: number;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [saldo, setSaldo] = useState(0);

  // 1. O Cérebro: Fica escutando 24h se o usuário está logado no Google
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth(); // Limpa o monitoramento se fechar o app
  }, []);

  // 2. Monitor de Saldo em Tempo Real (Agora ligado ao UID do Google)
  useEffect(() => {
    if (user?.uid) {
      // Puxa o saldo da ficha do usuário direto do Firebase
      const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setSaldo(docSnap.data().saldo || 0);
        }
      });
      return () => unsub();
    } else {
      setSaldo(0);
    }
  }, [user]);

  // 3. Função oficial para deslogar
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setSaldo(0);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, saldo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);