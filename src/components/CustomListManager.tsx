
import { CustomListEntry } from "@/types";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomListManagerProps {
  entries: CustomListEntry[];
  onAddEntry: (entry: Omit<CustomListEntry, "id" | "addedAt">) => void;
  onRemoveEntry: (id: string) => void;
  className?: string;
}

export function CustomListManager({ entries, onAddEntry, onRemoveEntry, className }: CustomListManagerProps) {
  const [value, setValue] = useState("");
  const [type, setType] = useState<"phone" | "ip" | "pattern">("phone");
  const [isBlocked, setIsBlocked] = useState(true);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("blocklist");

  const blockedEntries = entries.filter((entry) => entry.isBlocked);
  const allowedEntries = entries.filter((entry) => !entry.isBlocked);

  const handleAddEntry = () => {
    if (!value.trim()) return;
    
    onAddEntry({
      value: value.trim(),
      type,
      isBlocked: activeTab === "blocklist",
      notes: notes.trim() || undefined,
    });
    
    setValue("");
    setNotes("");
  };

  const getTypeLabel = (type: CustomListEntry["type"]) => {
    switch (type) {
      case "phone":
        return "Telefone";
      case "ip":
        return "Endereço IP";
      case "pattern":
        return "Padrão";
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Listas Personalizadas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="blocklist" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="blocklist">Lista de Bloqueio</TabsTrigger>
            <TabsTrigger value="allowlist">Lista de Permissão</TabsTrigger>
          </TabsList>
          
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <Input 
                  placeholder="Digite telefone, IP ou padrão" 
                  value={value} 
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <Select 
                value={type} 
                onValueChange={(value) => setType(value as "phone" | "ip" | "pattern")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="ip">IP</SelectItem>
                  <SelectItem value="pattern">Padrão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Input 
              placeholder="Notas opcionais" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
            />
            
            <Button 
              onClick={handleAddEntry} 
              className="w-full bg-shield-500 hover:bg-shield-600"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar à {activeTab === "blocklist" ? "Lista de Bloqueio" : "Lista de Permissão"}
            </Button>
          </div>
          
          <TabsContent value="blocklist">
            <div className="text-sm font-medium mb-2">Itens Bloqueados ({blockedEntries.length})</div>
            <ScrollArea className="h-[180px]">
              {blockedEntries.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-4">
                  Sua lista de bloqueio está vazia
                </p>
              ) : (
                <div className="space-y-2">
                  {blockedEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between bg-danger-light/30 rounded p-2 text-sm">
                      <div>
                        <div className="font-medium">{entry.value}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                            {getTypeLabel(entry.type)}
                          </span>
                          {entry.notes && <span>{entry.notes}</span>}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" 
                        onClick={() => onRemoveEntry(entry.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="allowlist">
            <div className="text-sm font-medium mb-2">Itens Permitidos ({allowedEntries.length})</div>
            <ScrollArea className="h-[180px]">
              {allowedEntries.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-4">
                  Sua lista de permissão está vazia
                </p>
              ) : (
                <div className="space-y-2">
                  {allowedEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between bg-success-light/30 rounded p-2 text-sm">
                      <div>
                        <div className="font-medium">{entry.value}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                            {getTypeLabel(entry.type)}
                          </span>
                          {entry.notes && <span>{entry.notes}</span>}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground" 
                        onClick={() => onRemoveEntry(entry.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
