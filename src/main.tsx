
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Manipulador de erros global simplificado
window.addEventListener('error', (event) => {
  if (event.message.includes('net::') || 
      event.message.includes('NetworkError') || 
      event.message.includes('Failed to fetch') ||
      event.message.includes('ERR_HTTP_RESPONSE_CODE')) {
    console.error('Problema de rede detectado:', event.message);
  }
});

// Reduzindo verificações periódicas de conectividade
let connectionChecks = 0;
const checkConnectivity = () => {
  if (navigator.onLine && connectionChecks < 5) { // Reduzido de 10 para 5 tentativas
    fetch('https://lovableproject.com/ping', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store'
    }).catch(() => {
      connectionChecks++;
    });
  } else if (connectionChecks >= 5) {
    clearInterval(connectivityInterval);
  }
};

// Verificar a cada 60 segundos em vez de 30
const connectivityInterval = setInterval(checkConnectivity, 60000);

// Renderização mais direta
try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  console.error('Erro crítico ao inicializar aplicativo:', error);
  setTimeout(() => {
    try {
      createRoot(document.getElementById("root")!).render(<App />);
    } catch {
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center">
          <h2>Erro ao inicializar o aplicativo</h2>
          <p>Por favor, verifique sua conexão e tente novamente.</p>
          <button onclick="window.location.reload()">Tentar novamente</button>
        </div>
      `;
    }
  }, 1000); // Reduzido de 2000ms para 1000ms
}
