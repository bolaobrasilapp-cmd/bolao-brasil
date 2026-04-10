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

  // 1. Escuta o Login do Google e traduz a foto!
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          nome: currentUser.displayName,
          foto: currentUser.photoURL, // <-- AQUI ESTÁ O SEGREDO DA FOTO!
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Monitor de Saldo e Dados do Firebase
  useEffect(() => {
    if (user?.uid) {
      const unsub = onSnapshot(doc(db, "usuarios", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          const dados = docSnap.data();
          setSaldo(dados.saldo || 0);
          // Junta a foto do Google com os dados (CPF, etc) do banco
          setUser((prev: any) => ({ ...prev, ...dados, foto: prev?.foto || dados.foto }));
        }
      });
      return () => unsub();
    } else {
      setSaldo(0);
    }
  }, [user?.uid]); // Só roda se o UID mudar

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