
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, ArrowRight, Info, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface GuideStep {
  title: string;
  description: string;
  icon: JSX.Element;
}

export function ConfigGuide() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  const steps: GuideStep[] = [
    {
      title: "Configuração do Call Shield",
      description: "Siga esse guia para configurar as permissões necessárias para o bloqueio funcionar corretamente.",
      icon: <Info className="h-10 w-10 text-neonBlue" />,
    },
    {
      title: "Acesse as Configurações",
      description: "Abra as configurações do seu dispositivo e encontre a seção 'Aplicativos' ou 'Aplicações'.",
      icon: <Settings className="h-10 w-10 text-neonBlue" />,
    },
    {
      title: "Permissões do Telefone",
      description: "Localize o Call Shield e ative as permissões de telefone para permitir o bloqueio de chamadas.",
      icon: <ShieldCheck className="h-10 w-10 text-neonBlue" />,
    }
  ];

  const currentStep = steps[step];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setOpen(false);
      setStep(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs bg-darkNeon-700/40 border-neonBlue/30 text-neonBlue hover:bg-darkNeon-700/60"
        >
          Guia de Configuração
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-darkNeon-900 border border-neonBlue/20">
        <DialogHeader>
          <DialogTitle className="text-neonBlue flex items-center gap-2">
            {currentStep.icon}
            <span>{currentStep.title}</span>
          </DialogTitle>
          <DialogDescription className="pt-4 text-white/70">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>
        
        {/* Visual guide with arrows */}
        <div className="relative py-6 flex justify-center">
          <div className="absolute w-full h-1 bg-neonBlue/20 top-1/2 -translate-y-1/2"></div>
          
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center mx-2
                ${i === step ? 'bg-neonBlue text-white' : 
                  i < step ? 'bg-neonBlue/70 text-white' : 'bg-darkNeon-700 text-white/50'}`}
            >
              {i === step && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonBlue opacity-30"></span>
              )}
              {i + 1}
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-6 text-neonBlue/50 h-4 w-4" />
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="sm:justify-between flex flex-row items-center">
          <span className="text-xs text-white/50">
            Passo {step + 1} de {steps.length}
          </span>
          <Button 
            onClick={nextStep} 
            className="bg-neonBlue hover:bg-neonBlue/80"
          >
            {step === steps.length - 1 ? 'Concluir' : 'Próximo'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
