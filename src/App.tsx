import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MainLayout } from './layout/MainLayout';
import { AuthProvider } from './contexts/AuthContext';

// Importação das páginas reais
const Home = lazy(() => import('./pages/Home'));
const Palpites = lazy(() => import('./pages/Palpites'));
const Participar = lazy(() => import('./pages/Participar'));
const CriarLiga = lazy(() => import('./pages/CriarLiga'));
const Login = lazy(() => import('./pages/Login'));
const Rankings = lazy(() => import('./pages/Rankings'));
const Pix = lazy(() => import('./pages/Pix'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Legal = lazy(() => import('./pages/Legal'));
const Calendario = lazy(() => import('./pages/Calendario'));

const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 text-center space-y-4 mt-10">
    <h2 className="text-2xl font-bold text-brazil-blue">{title}</h2>
    <p className="text-gray-500">Esta tela está em construção para o nosso MVP! ⚽</p>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
              <div className="w-12 h-12 border-4 border-brazil-green border-t-brazil-yellow rounded-full animate-spin" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="/criar-liga" element={<CriarLiga />} />
                <Route path="/login" element={<Login />} />
                <Route path="participar" element={<Participar />} />
                <Route path="palpites" element={<Palpites />} />
                <Route path="calendario" element={<Calendario />} />
                <Route path="rankings" element={<Rankings />} />
                <Route path="pix" element={<Pix />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="legal/:pagina" element={<Legal />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}