import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Suas chaves de conexão (O "RG" do seu banco de dados)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "COLE_SUA_API_KEY_AQUI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bolao-brasil.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bolao-brasil",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bolao-brasil.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "COLE_SEU_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "COLE_SEU_APP_ID"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Exportando as ferramentas que vamos usar no resto do App
export const db = getFirestore(app);
export const auth = getAuth(app);