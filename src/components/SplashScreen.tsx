
import { Shield } from "./Shield";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-shield-700 to-shield-900 flex items-center justify-center">
      <div className="animate-fade-in flex flex-col items-center">
        <Shield active size="xl" className="mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Call Shield</h1>
        <p className="text-shield-200">Proteção de Chamadas VoIP</p>
      </div>
    </div>
  );
}
