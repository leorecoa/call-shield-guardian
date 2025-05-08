
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simplified initialization with focused error handling
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Elemento root não encontrado");
  }
} catch (error) {
  console.error('Erro crítico ao inicializar aplicativo:', error);
  
  // Simple error recovery attempt
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
