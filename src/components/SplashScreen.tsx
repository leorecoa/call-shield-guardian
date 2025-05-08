
import { ShieldCheck } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-darkNeon-900 via-darkNeon-800 to-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background animated elements - simplified */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-neonBlue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-neonGreen/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-2/3 left-1/2 w-24 h-24 bg-neonBlue/15 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
      </div>
      
      <div className="animate-fade-in flex flex-col items-center relative z-10">
        <div className="relative mb-6">
          {/* Simplified glow effects */}
          <div className="absolute inset-0 scale-150 bg-neonBlue/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 scale-150 bg-gradient-to-r from-neonBlue/5 to-neonGreen/5 rounded-full blur-xl animate-spin-slow"></div>
          <img 
            src="/lovable-uploads/fab841df-3f21-4b5f-99ad-6de9fc9f5586.png" 
            alt="Call Shield Logo" 
            className="w-36 h-36 sm:w-40 sm:h-40 relative z-10 animate-pulse-shield drop-shadow-glow" 
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 relative">
          <span className="absolute inset-0 blur-sm bg-neonBlue/30 animate-pulse"></span>
          <span className="relative">Call Shield</span>
        </h1>
        <p className="text-sm sm:text-base text-neonBlue font-medium tracking-wide">Proteção VoIP</p>
        
        <div className="mt-8 flex items-center gap-2 bg-darkNeon-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-neonBlue/20 shadow-glow">
          <ShieldCheck className="w-5 h-5 text-neonGreen animate-pulse" />
          <span className="text-sm text-white/80">Sistema de Segurança Ativado</span>
        </div>
      </div>
      
      <div className="absolute bottom-10 w-full max-w-xs">
        <div className="h-1 bg-darkNeon-700 rounded-full overflow-hidden shadow-glow-sm">
          <div className="h-full bg-gradient-to-r from-neonBlue to-neonGreen/80 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
