
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
import { AlertTriangle, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Reduzido para minimizar espera em caso de falhas
      retryDelay: attemptIndex => Math.min(1000 * 1.5 ** attemptIndex, 5000), // Menor tempo máximo
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
  },
});

const NetworkCheck = () => {
  const { toast } = useToast();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [serverUnreachable, setServerUnreachable] = useState(false);
  
  useEffect(() => {
    const checkNetwork = () => {
      const online = navigator.onLine;
      setIsOffline(!online);
      
      if (online) {
        // Verificar se o servidor está acessível com timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        fetch('https://lovableproject.com/ping', { 
          method: 'HEAD',
          signal: controller.signal,
          mode: 'no-cors',
          cache: 'no-store'
        })
        .then(() => {
          setServerUnreachable(false);
          clearTimeout(timeoutId);
        })
        .catch(() => {
          setServerUnreachable(true);
          clearTimeout(timeoutId);
        });
      }
    };

    // Verificar imediatamente e depois periodicamente
    checkNetwork();
    const intervalId = setInterval(checkNetwork, 15000);
    
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "Conexão restaurada",
        description: "Você está conectado à internet novamente",
      });
      window.location.reload(); // Recarregar para garantir o funcionamento correto
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "Sem conexão",
        description: "Verifique sua conexão com a internet",
        variant: "destructive",
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);
  
  if (isOffline || serverUnreachable) {
    return (
      <Alert variant="destructive" className="fixed bottom-4 left-4 right-4 z-50 animate-bounce mb-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Problemas de conexão</AlertTitle>
        <AlertDescription>
          {isOffline ? (
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4" />
              <span>Você está offline. Verifique sua conexão.</span>
            </div>
          ) : (
            <span>Não foi possível conectar ao servidor.</span>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Inicializar o app mais rapidamente
    const preloadResources = async () => {
      try {
        // Reduzindo ainda mais o tempo de simulação
        await new Promise(r => setTimeout(r, 100));
        setIsAppReady(true);
        
        // Reduzindo tempo da tela de splash
        setTimeout(() => {
          setShowSplash(false);
        }, 500);
      } catch (error) {
        console.error("Erro no carregamento:", error);
        setIsAppReady(true);
        setShowSplash(false);
      }
    };
    
    preloadResources();
    
    // Verificar se o dispositivo está online ao iniciar
    if (!navigator.onLine) {
      console.warn("Dispositivo offline ao iniciar o app");
    }
    
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
          <div className={`app-container transition-opacity duration-200 ${isAppReady ? 'opacity-100' : 'opacity-0'}`}>
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
