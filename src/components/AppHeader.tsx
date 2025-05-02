
import { Shield, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  isActive: boolean;
  onToggleActive: () => void;
}

export function AppHeader({ isActive, onToggleActive }: AppHeaderProps) {
  return (
    <header className="relative overflow-hidden flex items-center justify-between p-5 bg-gradient-to-r from-darkNeon-800 to-darkNeon-700 backdrop-blur-md border border-neonBlue/20 shadow-lg rounded-lg mb-6">
      {/* Background glow effect */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[100%] bg-neonBlue/5 animate-spin duration-[20000ms] rounded-full blur-3xl"></div>
        </div>
      )}
      
      <div className="flex items-center relative z-10">
        <div className="relative">
          {isActive && <div className="absolute inset-0 bg-neonBlue/20 rounded-full animate-pulse"></div>}
          <img
            src="/lovable-uploads/fab841df-3f21-4b5f-99ad-6de9fc9f5586.png"
            alt="Call Shield Logo"
            className={cn(
              "w-12 h-12 rounded-xl",
              isActive && "animate-pulse-shield"
            )}
          />
        </div>
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-white">
            Call <span className="text-neonBlue">Shield</span>
          </h1>
          <p className="text-sm text-neonGreen/90 font-medium">Proteção Avançada contra Chamadas VoIP</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "px-3 py-1.5 rounded-full flex items-center gap-2",
          isActive 
            ? "bg-neonGreen/20 text-neonGreen border border-neonGreen/30" 
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        )}>
          {isActive ? (
            <ShieldCheck className="w-4 h-4" />
          ) : (
            <Shield className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isActive ? "Proteção Ativa" : "Proteção Inativa"}
          </span>
        </div>
        
        <Switch 
          checked={isActive} 
          onCheckedChange={onToggleActive}
          className={cn(
            "data-[state=checked]:bg-neonGreen",
            "relative overflow-visible"
          )}
        />
      </div>
    </header>
  );
}
