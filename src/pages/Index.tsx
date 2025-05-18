import { lazy, Suspense } from 'react';

// Importação lazy do App para reduzir o bundle inicial
const App = lazy(() => import('../App'));

export default function Index() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-darkNeon-900">
        <div className="text-neonBlue text-xl">Carregando Call Shield Guardian...</div>
      </div>
    }>
      <App />
    </Suspense>
  );
}