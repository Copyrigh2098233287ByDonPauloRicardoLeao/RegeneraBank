import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from '../AppRouter';

// Mocking dos componentes principais para isolar o Router
vi.mock('../features/auth/Login', () => ({
  default: () => <div data-testid="login-page">Login Page</div>
}));

vi.mock('../features/dashboard/Dashboard', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>
}));

describe('AppRouter (Frontend)', () => {
  it('Deve renderizar a tela de Login na rota padrão "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('Deve renderizar o Dashboard ao navegar para "/dashboard"', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('Deve renderizar a página de erro (404) para rotas inexistentes', () => {
    render(
      <MemoryRouter initialEntries={['/rota-aleatoria-inexistente']}>
        <AppRouter />
      </MemoryRouter>
    );

    // Supondo que o AppRouter possua um fallback "Página não encontrada"
    expect(screen.getByText(/404|não encontrada/i)).toBeInTheDocument();
  });
});
