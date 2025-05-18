import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlockSettings } from './BlockSettings';

// Mock dos hooks necessários
vi.mock('@/hooks/useCallBlocker', () => ({
  useCallBlocker: () => ({
    settings: {
      blockAll: false,
      blockAnonymous: true,
      blockNoValidNumber: true,
      blockSuspiciousIP: true,
      blockUnknownServers: false
    },
    updateSettings: vi.fn()
  })
}));

vi.mock('@/hooks/useBridgeNative', () => ({
  useBridgeNative: () => ({
    requestNotificationPermission: vi.fn(() => Promise.resolve({ granted: true })),
    hasNotificationPermission: false
  })
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('BlockSettings Component', () => {
  it('deve renderizar todas as opções de configuração', () => {
    render(<BlockSettings />);
    
    // Verificar se os títulos das configurações estão presentes
    expect(screen.getByText(/Bloquear chamadas anônimas/i)).toBeInTheDocument();
    expect(screen.getByText(/Bloquear números inválidos/i)).toBeInTheDocument();
    expect(screen.getByText(/Bloquear IPs suspeitos/i)).toBeInTheDocument();
    expect(screen.getByText(/Bloquear servidores desconhecidos/i)).toBeInTheDocument();
    expect(screen.getByText(/Bloquear todas as chamadas/i)).toBeInTheDocument();
  });

  it('deve mostrar o botão de ativar notificações quando não tem permissão', () => {
    render(<BlockSettings />);
    
    // Verificar se o botão de ativar notificações está presente
    const button = screen.getByText(/Ativar/i);
    expect(button).toBeInTheDocument();
  });

  it('deve chamar a função de solicitar permissão quando o botão é clicado', async () => {
    render(<BlockSettings />);
    
    // Encontrar o botão e clicar nele
    const button = screen.getByText(/Ativar/i);
    fireEvent.click(button);
    
    // Verificar se o botão muda para "Solicitado"
    expect(await screen.findByText(/Solicitado/i)).toBeInTheDocument();
  });
});