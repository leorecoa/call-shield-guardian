
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function ExportCapacitor() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulando a exportação do projeto
  const handleExport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Em uma implementação real, isso chamaria um serviço de backend
      // para criar o arquivo .zip do projeto Capacitor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulando o download do arquivo (em uma implementação real, isso seria um link real)
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', 'call-shield-guardian.zip');
      link.click();
      
      // Podemos fechar o modal após um breve atraso
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('Ocorreu um erro ao exportar o projeto. Tente novamente.');
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="text-sm"
      >
        Exportar para Capacitor
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exportar para Capacitor</DialogTitle>
            <DialogDescription>
              Exporte seu projeto para desenvolver com Capacitor no Android e iOS
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>Plataformas Suportadas</Label>
              <div className="flex gap-2">
                <Badge>Android</Badge>
                <Badge>iOS</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>O arquivo .zip conterá:</Label>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Código fonte do projeto React</li>
                <li>Configuração do Capacitor</li>
                <li>Pastas nativas Android e iOS</li>
                <li>Instruções de compilação</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleExport}
              disabled={loading}
              className="bg-shield-500 hover:bg-shield-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download .zip
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
