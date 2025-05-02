
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SplashScreen } from "@/components/SplashScreen";
import { useEffect, useState } from "react";
import { useToast } from "./hooks/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const NetworkCheck = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    const checkNetwork = () => {
      if (!navigator.onLine) {
        toast({
          title: "Sem conexão",
          description: "Verifique sua conexão com a internet",
          variant: "destructive",
        });
      } else {
        // Verificar se o servidor está acessível
        fetch('https://8458a5d6-7702-4670-9804-6353f343f574.lovableproject.com/ping', { 
          method: 'HEAD',
          mode: 'no-cors'
        }).catch(() => {
          console.log("Servidor pode estar indisponível, mas continuando operação local");
        });
      }
    };

    checkNetwork();
    
    window.addEventListener('online', () => {
      toast({
        title: "Conexão restaurada",
        description: "Você está conectado à internet novamente",
      });
    });
    
    window.addEventListener('offline', () => {
      toast({
        title: "Sem conexão",
        description: "Verifique sua conexão com a internet",
        variant: "destructive",
      });
    });
    
    return () => {
      window.removeEventListener('online', () => {});
      window.removeEventListener('offline', () => {});
    };
  }, [toast]);
  
  return null;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Pré-carregamento de recursos importantes
    const preloadResources = async () => {
      // Simula carregamento de recursos críticos
      await new Promise(r => setTimeout(r, 800));
      setIsAppReady(true);
      
      // Ocultar tela de splash com um atraso para mostrar animações
      setTimeout(() => {
        setShowSplash(false);
      }, 1500);
    };
    
    preloadResources();
    
    return () => {
      // Limpar qualquer coisa pendente
    };
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <NetworkCheck />
        <BrowserRouter>
          <div className={`app-container transition-opacity duration-300 ${isAppReady ? 'opacity-100' : 'opacity-0'}`}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
