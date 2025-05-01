
import { Shield } from "@/components/Shield";
import { Switch } from "@/components/ui/switch";

interface AppHeaderProps {
  isActive: boolean;
  onToggleActive: () => void;
}

export function AppHeader({ isActive, onToggleActive }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-darkNeon-700/50 backdrop-blur-sm border border-neonBlue/20 shadow-lg rounded-lg mb-6">
      <div className="flex items-center">
        <img
          src="/lovable-uploads/fab841df-3f21-4b5f-99ad-6de9fc9f5586.png"
          alt="Call Shield Logo"
          className="w-10 h-10"
        />
        <div className="ml-3">
          <h1 className="text-xl font-bold text-neonBlue">Call Shield</h1>
          <p className="text-sm text-neonGreen">Proteção de Chamadas VoIP</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-neonBlue">
          {isActive ? "Ativo" : "Inativo"}
        </span>
        <Switch 
          checked={isActive} 
          onCheckedChange={onToggleActive}
          className="data-[state=checked]:bg-neonGreen"
        />
      </div>
    </header>
  );
}
