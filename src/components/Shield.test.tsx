import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Shield } from './Shield';

describe('Shield Component', () => {
  it('deve renderizar o componente Shield corretamente quando ativo', () => {
    render(<Shield isActive={true} hasPermissions={true} onClick={() => {}} />);
    
    // Verificar se o texto de proteção ativa está presente
    expect(screen.getByText(/Proteção Ativa/i)).toBeInTheDocument();
  });

  it('deve renderizar o componente Shield corretamente quando inativo', () => {
    render(<Shield isActive={false} hasPermissions={true} onClick={() => {}} />);
    
    // Verificar se o texto de proteção inativa está presente
    expect(screen.getByText(/Proteção Inativa/i)).toBeInTheDocument();
  });

  it('deve mostrar aviso de permissões quando não tem permissões', () => {
    render(<Shield isActive={true} hasPermissions={false} onClick={() => {}} />);
    
    // Verificar se o aviso de permissões está presente
    expect(screen.getByText(/Permissões necessárias/i)).toBeInTheDocument();
  });

  it('deve chamar a função onClick quando clicado', () => {
    const handleClick = vi.fn();
    render(<Shield isActive={true} hasPermissions={true} onClick={handleClick} />);
    
    // Encontrar o botão e clicar nele
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Verificar se a função foi chamada
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});