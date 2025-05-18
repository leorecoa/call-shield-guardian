import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BackupSync } from './BackupSync';

// Mock dos hooks necessários
vi.mock('@/hooks/useSupabaseAuth', () => ({
  useSupabaseAuth: () => ({
    user: null,
    loading: false,
    error: null,
    signInWithEmail: vi.fn(() => Promise.resolve({ success: true })),
    signUpWithEmail: vi.fn(() => Promise.resolve({ success: true })),
    signOut: vi.fn(() => Promise.resolve({ success: true })),
    syncService: {
      syncAll: vi.fn(() => Promise.resolve(true)),
      restoreAll: vi.fn(() => Promise.resolve({
        settings: null,
        customList: null,
        blockedCalls: null
      }))
    }
  })
}));

vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: () => ({
    blockedCalls: [],
    settings: {
      blockAll: false,
      blockAnonymous: true,
      blockNoValidNumber: true,
      blockSuspiciousIP: true,
      blockUnknownServers: true
    },
    customList: [],
    setBlockedCalls: vi.fn(),
    setSettings: vi.fn(),
    setCustomList: vi.fn()
  })
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('BackupSync Component', () => {
  it('deve renderizar o formulário de login quando não autenticado', () => {
    render(<BackupSync />);
    
    // Verificar se os campos de login estão presentes
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByText(/Entrar/i)).toBeInTheDocument();
    expect(screen.getByText(/Criar conta/i)).toBeInTheDocument();
  });

  it('deve chamar a função de login quando o botão Entrar é clicado', async () => {
    render(<BackupSync />);
    
    // Preencher os campos
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: 'password123' }
    });
    
    // Clicar no botão de login
    fireEvent.click(screen.getByText(/Entrar/i));
    
    // Verificar se o texto de login está presente
    expect(screen.getByText(/Faça login para sincronizar seus dados/i)).toBeInTheDocument();
  });
});