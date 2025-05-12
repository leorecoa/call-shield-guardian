
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Improved initialization with focused error handling
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  } else {
    console.error("Root element not found");
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center">
        <h2>Unable to initialize application</h2>
        <p>The root element was not found.</p>
        <button onclick="window.location.reload()">Reload</button>
      </div>
    `;
  }
} catch (error) {
  console.error('Critical error initializing app:', error);
  
  // Simple error recovery attempt with better fallback
  setTimeout(() => {
    try {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        createRoot(rootElement).render(<App />);
      } else {
        throw new Error("Root element not found");
      }
    } catch (err) {
      console.error('Failed second initialization attempt:', err);
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: system-ui, -apple-system, sans-serif;">
          <h2>Error initializing application</h2>
          <p>Please check your connection and try again.</p>
          <button style="padding: 8px 16px; background: #3589B8; color: white; border: none; border-radius: 4px; cursor: pointer;" 
                  onclick="window.location.reload()">
            Try Again
          </button>
        </div>
      `;
    }
  }, 1000);
}
