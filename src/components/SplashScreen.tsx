import { useEffect, useState } from 'react';
import { Shield } from './Shield';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  minDisplayTime?: number;
}

export function SplashScreen({ onComplete, minDisplayTime = 2000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, minDisplayTime);
    
    return () => clearTimeout(timer);
  }, [minDisplayTime]);
  
  useEffect(() => {
    if (!isVisible) {
      // Pequeno delay para permitir que a animação de saída termine
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 500);
      
      return () => clearTimeout(exitTimer);
    }
  }, [isVisible, onComplete]);
  
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-darkNeon-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: 0.2
            }}
          >
            <Shield active size="xl" />
          </motion.div>
          
          <motion.h1
            className="mt-8 text-4xl font-bold text-neonBlue"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Call Shield Guardian
          </motion.h1>
          
          <motion.p
            className="mt-4 text-lg text-neonBlue/80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Proteção inteligente contra chamadas indesejadas
          </motion.p>
          
          <motion.div
            className="mt-12 flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="w-3 h-3 rounded-full bg-neonBlue animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-neonPurple animate-pulse [animation-delay:200ms]" />
            <div className="w-3 h-3 rounded-full bg-neonPink animate-pulse [animation-delay:400ms]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}