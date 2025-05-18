import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SyncService } from '@/integrations/supabase/syncService';

// Instância global do serviço de sincronização
export const syncService = new SyncService();

export function useSupabaseAuth() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar sessão atual ao iniciar
  useEffect(() => {
    async function checkSession() {
      try {
        setLoading(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email
          };
          setUser(userData);
          syncService.setUser(userData);
        } else {
          setUser(null);
          syncService.setUser(null);
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }
    
    checkSession();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email
          };
          setUser(userData);
          syncService.setUser(userData);
        } else {
          setUser(null);
          syncService.setUser(null);
        }
        setLoading(false);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login com email e senha
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao fazer login' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cadastro com email e senha
  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // Criar perfil de usuário
      if (data.user) {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          email: data.user.email,
          created_at: new Date().toISOString()
        });
      }
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao criar conta:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao criar conta' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer logout');
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao fazer logout' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    syncService
  };
}