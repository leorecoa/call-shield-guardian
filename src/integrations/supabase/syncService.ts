import { supabase } from './client';
import { BlockedCall, BlockSettings, CustomListEntry } from '@/types';

// Interface para o usuário
interface User {
  id: string;
  email?: string;
}

// Classe para gerenciar a sincronização com o Supabase
export class SyncService {
  private user: User | null = null;

  // Definir o usuário atual
  setUser(user: User | null) {
    this.user = user;
  }

  // Obter o usuário atual
  getUser() {
    return this.user;
  }

  // Verificar se o usuário está autenticado
  isAuthenticated() {
    return !!this.user;
  }

  // Sincronizar configurações de bloqueio
  async syncBlockSettings(settings: BlockSettings): Promise<boolean> {
    if (!this.user) return false;

    try {
      const { error } = await supabase
        .from('block_settings')
        .upsert({
          id: crypto.randomUUID(),
          user_id: this.user.id,
          block_all: settings.blockAll,
          block_anonymous: settings.blockAnonymous,
          block_unknown_servers: settings.blockUnknownServers,
          block_no_valid_number: settings.blockNoValidNumber,
          block_suspicious_ip: settings.blockSuspiciousIP,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao sincronizar configurações:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao sincronizar configurações:', error);
      return false;
    }
  }

  // Sincronizar lista personalizada
  async syncCustomList(list: CustomListEntry[]): Promise<boolean> {
    if (!this.user) return false;

    try {
      // Primeiro, excluir entradas antigas
      await supabase
        .from('custom_list')
        .delete()
        .eq('user_id', this.user.id);

      // Inserir novas entradas
      if (list.length > 0) {
        const { error } = await supabase
          .from('custom_list')
          .insert(
            list.map(item => ({
              id: item.id,
              user_id: this.user!.id,
              value: item.value,
              type: item.type,
              is_blocked: item.isBlocked,
              added_at: item.addedAt,
              notes: item.notes || null
            }))
          );

        if (error) {
          console.error('Erro ao sincronizar lista personalizada:', error);
          return false;
        }
      }

      // Atualizar timestamp de sincronização
      await supabase
        .from('user_profiles')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', this.user.id);

      return true;
    } catch (error) {
      console.error('Erro ao sincronizar lista personalizada:', error);
      return false;
    }
  }

  // Sincronizar chamadas bloqueadas
  async syncBlockedCalls(calls: BlockedCall[]): Promise<boolean> {
    if (!this.user) return false;

    try {
      // Limitar a 100 chamadas mais recentes para evitar problemas de desempenho
      const recentCalls = calls.slice(0, 100);

      // Primeiro, excluir chamadas antigas
      await supabase
        .from('blocked_calls')
        .delete()
        .eq('user_id', this.user.id);

      // Inserir novas chamadas
      if (recentCalls.length > 0) {
        const { error } = await supabase
          .from('blocked_calls')
          .insert(
            recentCalls.map(call => ({
              id: call.id,
              user_id: this.user!.id,
              source_ip: call.sourceIP || null,
              phone_number: call.phoneNumber || null,
              timestamp: call.timestamp,
              call_type: call.callType,
              is_voip: call.isVoIP
            }))
          );

        if (error) {
          console.error('Erro ao sincronizar chamadas bloqueadas:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erro ao sincronizar chamadas bloqueadas:', error);
      return false;
    }
  }

  // Recuperar configurações de bloqueio
  async fetchBlockSettings(): Promise<BlockSettings | null> {
    if (!this.user) return null;

    try {
      const { data, error } = await supabase
        .from('block_settings')
        .select('*')
        .eq('user_id', this.user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.error('Erro ao recuperar configurações:', error);
        return null;
      }

      return {
        blockAll: data.block_all,
        blockAnonymous: data.block_anonymous,
        blockUnknownServers: data.block_unknown_servers,
        blockNoValidNumber: data.block_no_valid_number,
        blockSuspiciousIP: data.block_suspicious_ip
      };
    } catch (error) {
      console.error('Erro ao recuperar configurações:', error);
      return null;
    }
  }

  // Recuperar lista personalizada
  async fetchCustomList(): Promise<CustomListEntry[] | null> {
    if (!this.user) return null;

    try {
      const { data, error } = await supabase
        .from('custom_list')
        .select('*')
        .eq('user_id', this.user.id);

      if (error) {
        console.error('Erro ao recuperar lista personalizada:', error);
        return null;
      }

      return data.map(item => ({
        id: item.id,
        value: item.value,
        type: item.type as 'ip' | 'phone' | 'pattern',
        isBlocked: item.is_blocked,
        addedAt: item.added_at,
        notes: item.notes || undefined
      }));
    } catch (error) {
      console.error('Erro ao recuperar lista personalizada:', error);
      return null;
    }
  }

  // Recuperar chamadas bloqueadas
  async fetchBlockedCalls(): Promise<BlockedCall[] | null> {
    if (!this.user) return null;

    try {
      const { data, error } = await supabase
        .from('blocked_calls')
        .select('*')
        .eq('user_id', this.user.id)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Erro ao recuperar chamadas bloqueadas:', error);
        return null;
      }

      return data.map(call => ({
        id: call.id,
        sourceIP: call.source_ip || undefined,
        phoneNumber: call.phone_number || undefined,
        timestamp: call.timestamp,
        callType: call.call_type as BlockedCall['callType'],
        isVoIP: call.is_voip
      }));
    } catch (error) {
      console.error('Erro ao recuperar chamadas bloqueadas:', error);
      return null;
    }
  }

  // Sincronizar tudo
  async syncAll(
    settings: BlockSettings,
    customList: CustomListEntry[],
    blockedCalls: BlockedCall[]
  ): Promise<boolean> {
    if (!this.user) return false;

    try {
      const settingsSuccess = await this.syncBlockSettings(settings);
      const customListSuccess = await this.syncCustomList(customList);
      const callsSuccess = await this.syncBlockedCalls(blockedCalls);

      return settingsSuccess && customListSuccess && callsSuccess;
    } catch (error) {
      console.error('Erro ao sincronizar tudo:', error);
      return false;
    }
  }

  // Restaurar tudo
  async restoreAll(): Promise<{
    settings: BlockSettings | null;
    customList: CustomListEntry[] | null;
    blockedCalls: BlockedCall[] | null;
  }> {
    if (!this.user) {
      return {
        settings: null,
        customList: null,
        blockedCalls: null
      };
    }

    try {
      const settings = await this.fetchBlockSettings();
      const customList = await this.fetchCustomList();
      const blockedCalls = await this.fetchBlockedCalls();

      return {
        settings,
        customList,
        blockedCalls
      };
    } catch (error) {
      console.error('Erro ao restaurar tudo:', error);
      return {
        settings: null,
        customList: null,
        blockedCalls: null
      };
    }
  }
}