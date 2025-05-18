<<<<<<< HEAD
import { useCallBlocker } from "@/hooks";
import { 
  AppHeader, 
  Shield, 
  StatsCard, 
  BlockSettings, 
  CustomListManager, 
  CallHistory, 
  TestControls,
  SecurityLevelSelector,
  SplashScreen
} from "@/components";
import { Toaster } from "@/components/ui";
import { useMobile } from "@/hooks";
import { useCallback, lazy, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

// Componente carregado sob demanda
const ConfigGuide = lazy(() => import('./components/ConfigGuide').then(module => ({ 
  default: module.ConfigGuide 
})));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    blockedCalls,
    stats,
    settings,
    customList,
    isActive,
    securityLevel,
    addCustomEntry,
    removeCustomEntry,
    toggleActive,
    updateSettings,
    clearBlockedCalls,
    simulateIncomingCall,
    applySecurityRules
  } = useCallBlocker();
  
  const { isMobile } = useMobile();
  
  // Handlers memoizados para evitar recriações desnecessárias
  const handleToggleActive = useCallback(() => {
    toggleActive();
  }, [toggleActive]);
  
  const handleUpdateSettings = useCallback((newSettings) => {
    updateSettings(newSettings);
  }, [updateSettings]);
  
  const handleAddCustomEntry = useCallback((entry) => {
    addCustomEntry(entry);
  }, [addCustomEntry]);
  
  const handleRemoveCustomEntry = useCallback((id) => {
    removeCustomEntry(id);
  }, [removeCustomEntry]);
  
  const handleClearHistory = useCallback(() => {
    clearBlockedCalls();
  }, [clearBlockedCalls]);
  
  const handleSimulateCall = useCallback((type) => {
    simulateIncomingCall(type);
  }, [simulateIncomingCall]);
  
  const handleSecurityLevelChange = useCallback((level: 'low' | 'medium' | 'high') => {
    applySecurityRules(level);
  }, [applySecurityRules]);
  
  const handleSplashComplete = useCallback(() => {
    setIsLoading(false);
  }, []);
  
  // Efeito para pré-carregar componentes
  useEffect(() => {
    // Pré-carregar o ConfigGuide em segundo plano
    const preloadConfigGuide = () => {
      import('./components/ConfigGuide');
    };
    
    // Agendar o pré-carregamento após o carregamento inicial
    const timer = setTimeout(preloadConfigGuide, 3000);
    
=======
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useToast } from "./hooks/use-toast";
import { AlertTriangle, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SplashScreen } from "@/components/SplashScreen";

// 🔧 Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 1.5 ** attemptIndex, 5000),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

// 🌐 Componente de verificação de rede
const NetworkCheck = () => {
  const { toast } = useToast();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [serverUnreachable, setServerUnreachable] = useState(false);

  useEffect(() => {
    const checkNetwork = () => {
      const online = navigator.onLine;
      setIsOffline(!online);

      if (online) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        fetch("https://lovableproject.com/ping", {
          method: "HEAD",
          signal: controller.signal,
          mode: "no-cors",
          cache: "no-store",
        })
          .then(() => {
            setServerUnreachable(false);
            clearTimeout(timeoutId);
          })
          .catch(() => {
            setServerUnreachable(true);
            clearTimeout(timeoutId);
            toast({
              title: "Erro de conexão com o servidor",
              description: "Estamos online, mas não conseguimos acessar o servidor.",
              variant: "destructive",
            });
          });
      }
    };

    const handleOnline = () => {
      setIsOffline(false);
      checkNetwork();
      toast({
        title: "Connection restored",
        description: "You are connected to the internet again",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "No connection",
        description: "Check your internet connection",
        variant: "destructive",
      });
    };

    checkNetwork();
    const intervalId = setInterval(checkNetwork, 15000);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  if (isOffline || serverUnreachable) {
    return (
      <Alert variant="destructive" className="fixed bottom-4 left-4 right-4 z-50 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Connection issues</AlertTitle>
        <AlertDescription>
          {isOffline ? (
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4" />
              <span>You are offline. Check your connection.</span>
            </div>
          ) : (
            <span>Could not connect to the server.</span>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

// 🚀 App principal
const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
      setShowSplash(false);
    }, 800);

>>>>>>> 81d237854107a6a9429327a3223334b5908b9bf3
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-darkNeon-900 text-white">
      <AppHeader 
        isActive={isActive} 
        onToggle={handleToggleActive} 
      />
      
      <main className="container mx-auto p-4 pb-20">
        <motion.div 
          className="flex flex-col items-center justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Shield active={isActive} size={isMobile ? "lg" : "xl"} />
          <h2 className="mt-4 text-2xl font-bold text-center text-neonBlue">
            {isActive ? "Proteção Ativa" : "Proteção Inativa"}
          </h2>
          <p className="mt-2 text-center text-muted-foreground max-w-md">
            {isActive 
              ? "Seu dispositivo está protegido contra chamadas indesejadas" 
              : "Ative a proteção para bloquear chamadas indesejadas"}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatsCard stats={stats} />
            <SecurityLevelSelector 
              level={securityLevel} 
              onLevelChange={handleSecurityLevelChange} 
            />
            <BlockSettings 
              settings={settings} 
              onUpdateSettings={handleUpdateSettings} 
            />
            <TestControls 
              onSimulateCall={handleSimulateCall} 
              isActive={isActive} 
            />
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CallHistory 
              calls={blockedCalls} 
              onClearHistory={handleClearHistory} 
            />
            <CustomListManager 
              entries={customList} 
              onAddEntry={handleAddCustomEntry} 
              onRemoveEntry={handleRemoveCustomEntry} 
            />
            
            {/* Componente carregado sob demanda */}
            {!isActive && (
              <Suspense fallback={
                <div className="p-4 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-neonBlue border-t-transparent"></div>
                  <p className="mt-2 text-neonBlue">Carregando guia...</p>
                </div>
              }>
                <ConfigGuide />
              </Suspense>
            )}
          </motion.div>
        </div>
      </main>
      
      <Toaster />
    </div>
=======
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <NetworkCheck />
        <BrowserRouter>
          <div
            className={`app-container transition-opacity duration-200 ${
              isAppReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
>>>>>>> 81d237854107a6a9429327a3223334b5908b9bf3
  );
}

export default App;