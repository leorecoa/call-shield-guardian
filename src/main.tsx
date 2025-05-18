import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Importações lazy para reduzir o bundle inicial
const Index = React.lazy(() => import('./pages/Index'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Fallback para carregamento
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-darkNeon-900">
    <div className="text-neonBlue text-xl">Carregando...</div>
  </div>
);

// Configuração do router
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <Index />
      </React.Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </React.Suspense>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);