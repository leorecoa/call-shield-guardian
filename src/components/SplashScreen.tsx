
import { cn } from "@/lib/utils";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-darkNeon-900 to-black flex items-center justify-center">
      <div className="animate-fade-in flex flex-col items-center">
        <img 
          src="/lovable-uploads/fab841df-3f21-4b5f-99ad-6de9fc9f5586.png" 
          alt="Call Shield Logo" 
          className={cn(
            "w-32 h-32 mb-6",
            "animate-pulse-shield"
          )} 
        />
        <h1 className="text-2xl font-bold text-neonBlue mb-2">Call Shield</h1>
        <p className="text-neonGreen">Proteção de Chamadas VoIP</p>
      </div>
    </div>
  );
}
