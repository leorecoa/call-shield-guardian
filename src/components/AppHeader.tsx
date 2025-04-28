
import { Shield } from "@/components/Shield";
import { Switch } from "@/components/ui/switch";

interface AppHeaderProps {
  isActive: boolean;
  onToggleActive: () => void;
}

export function AppHeader({ isActive, onToggleActive }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg mb-6">
      <div className="flex items-center">
        <Shield active={isActive} size="md" />
        <div className="ml-3">
          <h1 className="text-xl font-bold text-shield-700">Call Shield</h1>
          <p className="text-sm text-muted-foreground">VoIP Call Protection</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">
          {isActive ? "Active" : "Inactive"}
        </span>
        <Switch 
          checked={isActive} 
          onCheckedChange={onToggleActive}
          className="data-[state=checked]:bg-shield-500"
        />
      </div>
    </header>
  );
}
