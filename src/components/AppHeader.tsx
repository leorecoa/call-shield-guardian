import { memo } from "react";
import { Shield } from "./Shield";
import { motion } from "framer-motion";

interface AppHeaderProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
}

function AppHeaderComponent({ isActive, onToggle, className }: AppHeaderProps) {
  return (
    <header className={`flex items-center justify-between p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Shield active={isActive} size="sm" />
        </motion.div>
        <motion.h1 
          className="text-xl font-bold text-neonBlue"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Call Shield Guardian
        </motion.h1>
      </div>
      <motion.button
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          isActive
            ? "bg-neonBlue text-white hover:bg-neonBlue/90"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isActive ? "Proteção Ativa" : "Proteção Inativa"}
      </motion.button>
    </header>
  );
}

// Exportar componente memoizado para evitar renderizações desnecessárias
export const AppHeader = memo(AppHeaderComponent);