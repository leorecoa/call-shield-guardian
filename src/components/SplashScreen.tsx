
import { ShieldCheck } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-darkNeon-900 via-darkNeon-800 to-black flex flex-col items-center justify-center overflow-hidden">
      {/* Enhanced background animated elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-neonBlue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-neonGreen/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-2/3 left-1/2 w-24 h-24 bg-neonBlue/15 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-neonBlue/10 rounded-full blur-3xl animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/5 w-28 h-28 bg-neonGreen/10 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]"></div>
        
        {/* Additional animated lines */}
        <div className="absolute h-[1px] w-[80%] left-[10%] top-1/4 bg-gradient-to-r from-transparent via-neonBlue/20 to-transparent animate-pulse [animation-delay:0.7s]"></div>
        <div className="absolute h-[1px] w-[60%] left-[20%] bottom-1/3 bg-gradient-to-r from-transparent via-neonGreen/20 to-transparent animate-pulse [animation-delay:1.2s]"></div>
      </div>
      
      <div className="animate-fade-in flex flex-col items-center relative z-10">
        <div className="relative mb-6 group">
          {/* Enhanced glow effects for the feature graphic */}
          <div className="absolute inset-0 scale-[2] bg-neonBlue/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 scale-[1.8] bg-gradient-to-r from-neonBlue/10 to-neonGreen/10 rounded-full blur-xl animate-spin-slow"></div>
          <div className="absolute inset-0 scale-[1.5] bg-neonBlue/5 rounded-full blur-md animate-pulse [animation-delay:700ms]"></div>
          <div className="absolute inset-0 scale-[1.3] border-2 border-neonBlue/20 rounded-full animate-spin-slow [animation-duration:12s]"></div>
          
          {/* Enhanced outer glow ring */}
          <div className="absolute inset-[-10px] scale-[1.2] border-4 border-neonBlue/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-[-20px] scale-[1.3] border border-neonGreen/5 rounded-full animate-spin-slow [animation-duration:15s]"></div>
          
          {/* App icon with enhanced effects */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-neonBlue/30 to-transparent rounded-full blur-xl animate-pulse"></div>
            <img 
              src="/lovable-uploads/fab841df-3f21-4b5f-99ad-6de9fc9f5586.png" 
              alt="Call Shield Logo" 
              className="w-36 h-36 sm:w-44 sm:h-44 relative z-10 animate-pulse-shield drop-shadow-glow group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          
          {/* Additional decorative elements around the logo */}
          <div className="absolute inset-0 z-20">
            <span className="absolute -top-5 -left-5 w-5 h-5 bg-neonBlue rounded-full blur-sm animate-pulse"></span>
            <span className="absolute -bottom-3 -right-3 w-4 h-4 bg-neonGreen rounded-full blur-sm animate-pulse [animation-delay:500ms]"></span>
            <span className="absolute top-1/2 -right-6 w-3 h-3 bg-neonBlue rounded-full blur-sm animate-pulse [animation-delay:1200ms]"></span>
            <span className="absolute bottom-1/4 -left-4 w-2 h-2 bg-neonBlue rounded-full blur-sm animate-pulse [animation-delay:800ms]"></span>
            
            {/* Added particles effect */}
            <span className="absolute top-1/5 right-1/4 w-1 h-1 bg-white rounded-full animate-ping [animation-duration:1.5s]"></span>
            <span className="absolute bottom-1/3 right-1/5 w-1 h-1 bg-white rounded-full animate-ping [animation-duration:2s]"></span>
            <span className="absolute top-2/5 -left-8 w-1 h-1 bg-white rounded-full animate-ping [animation-duration:2.5s]"></span>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 relative">
          <span className="absolute inset-0 blur-sm bg-neonBlue/30 animate-pulse"></span>
          <span className="relative">Call Shield</span>
          {/* Added light beam effect */}
          <div className="absolute -inset-x-6 h-1 top-1/2 bg-gradient-to-r from-transparent via-neonBlue/30 to-transparent animate-pulse [animation-delay:1s]"></div>
        </h1>
        <p className="text-sm sm:text-lg text-neonBlue font-medium tracking-wide">Proteção VoIP</p>
        
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
