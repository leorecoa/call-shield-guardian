import { Card, CardContent, CardHeader, CardTitle, RadioGroup, RadioGroupItem, Label } from "@/components/ui";
import { SectionImage } from "./SectionImage";
import { memo, useCallback } from "react";

interface SecurityLevelSelectorProps {
  level: 'low' | 'medium' | 'high';
  onLevelChange: (level: 'low' | 'medium' | 'high') => void;
  className?: string;
}

function SecurityLevelSelectorComponent({ 
  level, 
  onLevelChange, 
  className 
}: SecurityLevelSelectorProps) {
  const handleLevelChange = useCallback((value: string) => {
    onLevelChange(value as 'low' | 'medium' | 'high');
  }, [onLevelChange]);

  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center space-x-2">
        <SectionImage section="security" size="sm" />
        <CardTitle className="text-lg font-semibold text-neonBlue">Nível de Segurança</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={level} 
          onValueChange={handleLevelChange}
          className="space-y-3"
        >
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-neonBlue/20 bg-darkNeon-700">
            <RadioGroupItem value="low" id="low" className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor="low" className="text-sm font-medium">Baixo</Label>
              <p className="text-xs text-muted-foreground">
                Bloqueia apenas fraudes óbvias e permite a maioria das chamadas.
                Ideal para quem recebe chamadas importantes de números desconhecidos.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-neonBlue/20 bg-darkNeon-700">
            <RadioGroupItem value="medium" id="medium" className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor="medium" className="text-sm font-medium">Médio</Label>
              <p className="text-xs text-muted-foreground">
                Bloqueia chamadas anônimas, telemarketing e fraudes conhecidas.
                Equilíbrio entre proteção e acessibilidade.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-neonBlue/20 bg-darkNeon-700">
            <RadioGroupItem value="high" id="high" className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor="high" className="text-sm font-medium">Alto</Label>
              <p className="text-xs text-muted-foreground">
                Proteção máxima. Bloqueia todas as chamadas suspeitas, incluindo servidores desconhecidos.
                Pode bloquear algumas chamadas legítimas.
              </p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export const SecurityLevelSelector = memo(SecurityLevelSelectorComponent);