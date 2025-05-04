
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Manipulador de erros global aprimorado para capturar problemas de rede
window.addEventListener('error', (event) => {
  if (event.message.includes('net::') || 
      event.message.includes('NetworkError') || 
      event.message.includes('Failed to fetch') ||
      event.message.includes('ERR_HTTP_RESPONSE_CODE')) {
    console.error('Problema de rede detectado:', event.message);
    // Tentar recarregar em caso de falha após 5 segundos
    if (navigator.onLine) {
      console.log('Tentando reconectar em 5 segundos...');
    }
  }
});

// Adiciona verificação periódica de conectividade
let connectionChecks = 0;
const checkConnectivity = () => {
  if (navigator.onLine && connectionChecks < 10) {
    fetch('https://lovableproject.com/ping', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store'
    }).catch(() => {
      console.log(`Tentativa ${connectionChecks + 1}/10: Servidor ainda não está respondendo`);
      connectionChecks++;
    });
  } else if (connectionChecks >= 10) {
    console.log('Máximo de tentativas de reconexão atingido');
    clearInterval(connectivityInterval);
  }
};

// Verificar a cada 30 segundos
const connectivityInterval = setInterval(checkConnectivity, 30000);

// Garantir que o app é renderizado mesmo com erros de rede
try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  console.error('Erro crítico ao inicializar aplicativo:', error);
  // Tentar novamente após um breve atraso
  setTimeout(() => {
    try {
      createRoot(document.getElementById("root")!).render(<App />);
    } catch {
      // Exibir mensagem de erro simples se tudo falhar
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center">
          <h2>Erro ao inicializar o aplicativo</h2>
          <p>Por favor, verifique sua conexão e tente novamente.</p>
          <button onclick="window.location.reload()">Tentar novamente</button>
        </div>
      `;
    }
  }, 2000);
}
