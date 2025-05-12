
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SplashScreen } from "@/components/SplashScreen";
import { useEffect, useState, memo } from "react";
import { useToast } from "./hooks/use-toast";
import { AlertTriangle, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Unified query client configuration
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

// Memorized network checking component to prevent unnecessary re-renders
const NetworkCheck = memo(() => {
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

    checkNetwork();
    const intervalId = setInterval(checkNetwork, 15000);
    
    const handleOnline = () => {
      setIsOffline(false);
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
});

NetworkCheck.displayName = 'NetworkCheck';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simplified app initialization
    const timer = setTimeout(() => {
      setIsAppReady(true);
      setShowSplash(false);
    }, 800);
    
    return () => clearTimeout(timer);
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
