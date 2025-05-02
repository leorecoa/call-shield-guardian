
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Adiciona um manipulador de erros global para capturar problemas de rede
window.addEventListener('error', (event) => {
  if (event.message.includes('net::') || event.message.includes('NetworkError')) {
    console.error('Problema de rede detectado:', event.message);
  }
});

createRoot(document.getElementById("root")!).render(<App />);
