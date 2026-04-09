import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Nosso "olheiro" global
  const [isVerifying, setIsVerifying] = useState(true);

  // 1. O "Leão de Chácara": Se o usuário já tiver logado, expulsa ele do Login e manda pra Home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Função centralizada para salvar o usuário no banco de dados
  const saveUserToFirestore = async (firebaseUser: any) => {
    try {
      const userRef = doc(db, "usuarios", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      // Só cria o perfil se for o primeiro acesso
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          nome: firebaseUser.displayName,
          email: firebaseUser.email,
          foto: firebaseUser.photoURL,
          pontos: 0,
          saldo: 0,
          uid: firebaseUser.uid,
          dataCadastro: new Date().toISOString()
        });
      }
      navigate('/');
    } catch (error) {
      console.error("Erro ao salvar no banco:", error);
    }
  };

  // 2. O "Catcher": Fica esperando o usuário voltar do redirecionamento do Google (no Celular)
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await saveUserToFirestore(result.user);
        }
      } catch (error) {
        console.error("Erro ao processar redirecionamento:", error);
      } finally {
        // Tira a tela de carregamento e mostra o botão se não houver login pendente
        setIsVerifying(false); 
      }
    };
    checkRedirect();
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    // Detecta se é celular (iOS ou Android)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    try {
      if (isMobile) {
        setIsVerifying(true); // Mostra o carregamento enquanto vai pro Google
        await signInWithRedirect(auth, provider);
      } else {
        // No PC, o popup é melhor e mais rápido
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          await saveUserToFirestore(result.user);
        }
      }
    } catch (error) {
      console.error("Erro ao logar:", error);
      alert("Falha na autenticação. Verifique sua conexão.");
      setIsVerifying(false);
    }
  };

  // TELA DE CARREGAMENTO (Evita que o botão pisque enquanto o Firebase pensa)
  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brazil-green text-white p-6 relative overflow-hidden">
        <div className="w-12 h-12 border-4 border-white border-t-brazil-yellow rounded-full animate-spin mb-4 shadow-lg" />
        <p className="font-bold uppercase tracking-widest text-xs animate-pulse">Autenticando Conta...</p>
      </div>
    );
  }

  // TELA DE LOGIN NORMAL
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brazil-green text-white p-6 relative overflow-hidden">
      <Helmet>
        <title>Entrar | Bolão Brasil</title>
      </Helmet>

      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brazil-yellow/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl rotate-3">
          <span className="text-4xl">⚽</span>
        </div>
        
        <h2 className="text-3xl font-black text-center mb-2 tracking-tight">Bolão Brasil</h2>
        <p className="text-white/80 text-center text-sm mb-10 font-medium">A maior rede de resenha do país. Entre em 1 segundo.</p>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white text-gray-800 font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google Logo" />
          Entrar com Google
        </button>
      </div>
    </div>
  );
}