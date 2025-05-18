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
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
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
  );
}

export default App;