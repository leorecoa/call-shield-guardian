import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Loader2, CloudSync, CloudOff, Save, Download, LogIn, LogOut, UserPlus } from 'lucide-react';

export function BackupSync() {
  const { toast } = useToast();
  const { user, loading, error, signInWithEmail, signUpWithEmail, signOut, syncService } = useSupabaseAuth();
  const { blockedCalls, settings, customList, setBlockedCalls, setSettings, setCustomList } = useLocalStorage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  
  // Função para sincronizar dados com a nuvem
  const handleSync = async () => {
    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Faça login para sincronizar seus dados",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSyncLoading(true);
      
      const success = await syncService.syncAll(settings, customList, blockedCalls);
      
      if (success) {
        toast({
          title: "Sincronização concluída",
          description: "Seus dados foram salvos na nuvem com sucesso",
          variant: "default"
        });
      } else {
        toast({
          title: "Erro na sincronização",
          description: "Não foi possível sincronizar seus dados",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um erro ao sincronizar seus dados",
        variant: "destructive"
      });
    } finally {
      setSyncLoading(false);
    }
  };
  
  // Função para restaurar dados da nuvem
  const handleRestore = async () => {
    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Faça login para restaurar seus dados",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setRestoreLoading(true);
      
      const { settings: cloudSettings, customList: cloudCustomList, blockedCalls: cloudBlockedCalls } = 
        await syncService.restoreAll();
      
      let restored = false;
      
      if (cloudSettings) {
        setSettings(cloudSettings);
        restored = true;
      }
      
      if (cloudCustomList && cloudCustomList.length > 0) {
        setCustomList(cloudCustomList);
        restored = true;
      }
      
      if (cloudBlockedCalls && cloudBlockedCalls.length > 0) {
        setBlockedCalls(cloudBlockedCalls);
        restored = true;
      }
      
      if (restored) {
        toast({
          title: "Restauração concluída",
          description: "Seus dados foram restaurados da nuvem com sucesso",
          variant: "default"
        });
      } else {
        toast({
          title: "Nenhum dado encontrado",
          description: "Não foram encontrados dados para restaurar",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Erro ao restaurar:", error);
      toast({
        title: "Erro na restauração",
        description: "Ocorreu um erro ao restaurar seus dados",
        variant: "destructive"
      });
    } finally {
      setRestoreLoading(false);
    }
  };
  
  // Função para fazer login
  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha para fazer login",
        variant: "destructive"
      });
      return;
    }
    
    const { success, error } = await signInWithEmail(email, password);
    
    if (success) {
      toast({
        title: "Login realizado",
        description: "Você está conectado à sua conta",
        variant: "default"
      });
      setEmail('');
      setPassword('');
    } else {
      toast({
        title: "Erro no login",
        description: error || "Não foi possível fazer login",
        variant: "destructive"
      });
    }
  };
  
  // Função para criar conta
  const handleSignUp = async () => {
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha para criar uma conta",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }
    
    const { success, error } = await signUpWithEmail(email, password);
    
    if (success) {
      toast({
        title: "Conta criada",
        description: "Sua conta foi criada com sucesso",
        variant: "default"
      });
      setEmail('');
      setPassword('');
    } else {
      toast({
        title: "Erro ao criar conta",
        description: error || "Não foi possível criar a conta",
        variant: "destructive"
      });
    }
  };
  
  // Função para fazer logout
  const handleLogout = async () => {
    const { success } = await signOut();
    
    if (success) {
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta",
        variant: "default"
      });
    } else {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Backup e Sincronização</CardTitle>
        <CardDescription>
          Salve e restaure suas configurações na nuvem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : user ? (
          <>
            <div className="flex items-center justify-between bg-muted p-3 rounded-md">
              <div>
                <p className="font-medium">Conectado como</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleSync} 
                disabled={syncLoading}
                className="w-full"
              >
                {syncLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar na nuvem
              </Button>
              
              <Button 
                onClick={handleRestore} 
                disabled={restoreLoading}
                variant="outline"
                className="w-full"
              >
                {restoreLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Restaurar
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>
                {syncLoading || restoreLoading ? (
                  "Processando..."
                ) : (
                  <>
                    <CloudSync className="inline-block mr-1 h-4 w-4" />
                    Seus dados são criptografados e seguros
                  </>
                )}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleLogin} className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Button>
              
              <Button onClick={handleSignUp} variant="outline" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Criar conta
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>
                <CloudOff className="inline-block mr-1 h-4 w-4" />
                Faça login para sincronizar seus dados
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}