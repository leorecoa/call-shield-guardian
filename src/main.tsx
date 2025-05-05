
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Manipulador de erros global para detectar problemas de conexão
window.addEventListener('error', (event) => {
  if (event.message.includes('net::') || 
      event.message.includes('NetworkError') || 
      event.message.includes('Failed to fetch') ||
      event.message.includes('ERR_HTTP_RESPONSE_CODE')) {
    console.error('Problema de rede detectado:', event.message);
    
    // Mostrar mensagem de erro na tela se for um problema de conexão crítico
    if (!navigator.onLine || event.message.includes('ERR_HTTP_RESPONSE_CODE_FAILURE')) {
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center">
          <h2>Erro de conexão</h2>
          <p>Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.</p>
          <button onclick="window.location.reload()">Tentar novamente</button>
        </div>
      `;
    }
  }
});

// Verificação simples de conectividade 
const checkConnectivity = () => {
  if (navigator.onLine) {
    fetch('https://lovableproject.com/ping', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store'
    }).catch(() => {
      console.log('Servidor não está respondendo');
    });
  }
};

// Verificar a cada 30 segundos
const connectivityInterval = setInterval(checkConnectivity, 30000);

// Inicializar o app com melhor tratamento de erros
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Elemento root não encontrado");
  }
} catch (error) {
  console.error('Erro crítico ao inicializar aplicativo:', error);
  
  // Tentar novamente uma vez após um breve atraso
  setTimeout(() => {
    try {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        createRoot(rootElement).render(<App />);
      }
    } catch (err) {
      console.error('Falha na segunda tentativa de inicialização:', err);
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center">
          <h2>Erro ao inicializar o aplicativo</h2>
          <p>Por favor, verifique sua conexão e tente novamente.</p>
          <button onclick="window.location.reload()">Tentar novamente</button>
        </div>
      `;
    }
  }, 1000);
}

// Monitora mudanças de estado da conexão
window.addEventListener('online', () => {
  console.log('Conexão restaurada');
  window.location.reload();
});

window.addEventListener('offline', () => {
  console.log('Conexão perdida');
});
