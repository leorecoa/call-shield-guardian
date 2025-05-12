
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simplified initialization with focused error handling
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Root element not found");
  }
} catch (error) {
  console.error('Critical error initializing app:', error);
  
  // Simple error recovery attempt
  setTimeout(() => {
    try {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        createRoot(rootElement).render(<App />);
      }
    } catch (err) {
      console.error('Failed second initialization attempt:', err);
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center">
          <h2>Error initializing application</h2>
          <p>Please check your connection and try again.</p>
          <button onclick="window.location.reload()">Try Again</button>
        </div>
      `;
    }
  }, 1000);
}
