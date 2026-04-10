import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Login() {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // O "Cão de Guarda" oficial do Firebase (Funciona 100% no celular)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Verifica se o usuário já existe na pasta 'usuarios'
          const userRef = doc(db, "usuarios", user.uid);
          const userSnap = await getDoc(userRef);

          // Se for o primeiro acesso da vida dele, cria a ficha
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              nome: user.displayName,
              email: user.email,
              foto: user.photoURL,
              pontos: 0,
              saldo: 0,
              uid: user.uid,
              dataCadastro: new Date().toISOString()
            });
          }
          
          // Sucesso! Manda para a Home
          navigate('/');
        } catch (error) {
          console.error("Erro ao salvar perfil:", error);
          setIsVerifying(false);
        }
      } else {
        // Se não tem ninguém logado (ou se ele deslogou), mostra a tela verde
        setIsVerifying(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsVerifying(true); // Começa a girar a roleta de carregamento
    const provider = new GoogleAuthProvider();

    try {
      // Abre a aba segura de login do Google
      await signInWithPopup(auth, provider);
      // Não precisamos dar 'navigate' aqui. O Cão de Guarda lá em cima 
      // vai detectar o login e fazer o redirecionamento sozinho!
    } catch (error) {
      console.error("Erro ao logar:", error);
      alert("Acesso cancelado ou falhou. Tente novamente.");
      setIsVerifying(false); // Para de carregar se der erro
    }
  };

  // TELA DE CARREGAMENTO (Evita piscar o botão)
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