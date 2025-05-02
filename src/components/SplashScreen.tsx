
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-darkNeon-900 to-black flex flex-col items-center justify-center">
      <div className="animate-fade-in flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-neonBlue/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 bg-neonBlue/30 rounded-full animate-pulse"></div>
          <img 
            src="/lovable-uploads/fab841df-3f21-4b5f-99ad-6de9fc9f5586.png" 
            alt="Call Shield Logo" 
            className="w-32 h-32 relative z-10 animate-pulse-shield" 
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 relative">
          <span className="absolute inset-0 blur-sm bg-neonBlue/30 animate-pulse"></span>
          <span className="relative">Call Shield</span>
        </h1>
        <p className="text-neonBlue font-medium">Proteção Avançada de Chamadas VoIP</p>
        
        <div className="mt-8 flex items-center gap-2 bg-darkNeon-800/50 px-4 py-2 rounded-full border border-neonBlue/20">
          <ShieldCheck className="w-5 h-5 text-neonGreen animate-pulse" />
          <span className="text-sm text-white/80">Sistema de Segurança Ativado</span>
        </div>
      </div>
      
      <div className="absolute bottom-10 w-full max-w-xs">
        <div className="h-1 bg-darkNeon-700 rounded-full overflow-hidden">
          <div className="h-full bg-neonBlue animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
