import { CustomListEntry } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Label, ScrollArea } from "@/components/ui";
import { Trash2, Plus } from "lucide-react";
import { SectionImage } from "./SectionImage";
import { memo, useCallback, useState } from "react";

interface CustomListManagerProps {
  entries: CustomListEntry[];
  onAddEntry: (entry: Omit<CustomListEntry, "id" | "addedAt">) => void;
  onRemoveEntry: (id: string) => void;
  className?: string;
}

// Componente de entrada individual memoizado
const EntryItem = memo(({ 
  entry, 
  onRemove 
}: { 
  entry: CustomListEntry; 
  onRemove: (id: string) => void;
}) => {
  const handleRemove = useCallback(() => {
    onRemove(entry.id);
  }, [entry.id, onRemove]);

  return (
    <div className="flex items-center justify-between p-3 bg-darkNeon-700 rounded-lg border border-neonBlue/20">
      <div>
        <div className="font-medium text-sm text-neonBlue">{entry.value}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="capitalize">{entry.type}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            entry.isBlocked 
              ? "bg-neonPink/20 text-neonPink" 
              : "bg-neonGreen/20 text-neonGreen"
          }`}>
            {entry.isBlocked ? "Bloqueado" : "Permitido"}
          </span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleRemove}
        className="h-8 w-8 p-0 text-neonPink hover:bg-neonPink/20"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
});

EntryItem.displayName = "EntryItem";

function CustomListManagerComponent({ 
  entries, 
  onAddEntry, 
  onRemoveEntry, 
  className 
}: CustomListManagerProps) {
  const [value, setValue] = useState("");
  const [type, setType] = useState<"phone" | "ip" | "pattern">("phone");
  const [isBlocked, setIsBlocked] = useState(true);

  const handleAddEntry = useCallback(() => {
    if (!value.trim()) return;
    
    onAddEntry({
      value: value.trim(),
      type,
      isBlocked,
      notes: ""
    });
    
    setValue("");
  }, [value, type, isBlocked, onAddEntry]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddEntry();
    }
  }, [handleAddEntry]);

  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-center space-x-2">
        <SectionImage section="custom" size="sm" />
        <CardTitle className="text-lg font-semibold text-neonYellow">Lista Personalizada</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                placeholder="Número ou IP"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Select 
                value={type} 
                onValueChange={(val) => setType(val as any)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="ip">IP</SelectItem>
                  <SelectItem value="pattern">Padrão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={isBlocked}
                  onCheckedChange={setIsBlocked}
                  id="block-mode"
                />
                <Label htmlFor="block-mode" className="text-sm">
                  {isBlocked ? "Bloquear" : "Permitir"}
                </Label>
              </div>
              
              <Button 
                onClick={handleAddEntry}
                size="sm" 
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
          
          {entries.length > 0 ? (
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-2">
                {entries.map((entry) => (
                  <EntryItem 
                    key={entry.id} 
                    entry={entry} 
                    onRemove={onRemoveEntry} 
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma entrada personalizada adicionada
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Exportar componente memoizado
export const CustomListManager = memo(CustomListManagerComponent);