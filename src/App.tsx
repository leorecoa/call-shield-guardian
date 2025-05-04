
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
      retry: 5, // Aumentando o número de tentativas
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});

const NetworkCheck = () => {
  const { toast } = useToast();
  const [isServerAvailable, setIsServerAvailable] = useState(true);
  
  useEffect(() => {
    const checkNetwork = () => {
      if (!navigator.onLine) {
        toast({
          title: "Sem conexão",
          description: "Verifique sua conexão com a internet",
          variant: "destructive",
        });
        setIsServerAvailable(false);
      } else {
        // Verificar se o servidor está acessível com timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        fetch('https://lovableproject.com/ping', { 
          method: 'HEAD',
          signal: controller.signal,
          mode: 'no-cors'
        })
        .then(() => {
          setIsServerAvailable(true);
          clearTimeout(timeoutId);
        })
        .catch((error) => {
          console.log("Erro ao verificar servidor: ", error.message);
          // Continuar mesmo com erro no servidor
          clearTimeout(timeoutId);
        });
      }
    };

    checkNetwork();
    
    // Verificar a cada 30 segundos
    const intervalId = setInterval(checkNetwork, 30000);
    
    const handleOnline = () => {
      toast({
        title: "Conexão restaurada",
        description: "Você está conectado à internet novamente",
      });
      setIsServerAvailable(true);
    };
    
    const handleOffline = () => {
      toast({
        title: "Sem conexão",
        description: "Verifique sua conexão com a internet",
        variant: "destructive",
      });
      setIsServerAvailable(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
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
      try {
        // Simula carregamento de recursos críticos
        await new Promise(r => setTimeout(r, 800));
        setIsAppReady(true);
        
        // Ocultar tela de splash com um atraso para mostrar animações
        setTimeout(() => {
          setShowSplash(false);
        }, 1500);
      } catch (error) {
        console.error("Erro no carregamento:", error);
        // Mesmo com erro, seguir para o app após um tempo
        setIsAppReady(true);
        setTimeout(() => {
          setShowSplash(false);
        }, 2000);
      }
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
