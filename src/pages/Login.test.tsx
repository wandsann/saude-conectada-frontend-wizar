import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import Login from './Login';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock environment variables
const originalEnv = process.env;
beforeAll(() => {
  process.env = {
    ...originalEnv,
    VITE_API_URL: 'http://localhost:3001',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Wrapper component to provide necessary context
const LoginWithProviders = () => (
  <BrowserRouter>
    <ToastProvider>
      <Login />
    </ToastProvider>
  </BrowserRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('pt-BR');
  });

  test('renders login form with required elements and proper accessibility attributes', () => {
    render(<LoginWithProviders />);
    
    // Test logo and title
    expect(screen.getByText('Saúde Conectada')).toBeInTheDocument();
    
    // Test form fields with ARIA attributes
    const cpfInput = screen.getByLabelText('Campo CPF');
    expect(cpfInput).toHaveAttribute('aria-invalid', 'false');
    expect(cpfInput).toHaveAttribute('placeholder', '000.000.000-00');
    
    const passwordInput = screen.getByLabelText('Campo Senha');
    expect(passwordInput).toHaveAttribute('aria-invalid', 'false');
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Test buttons with proper ARIA labels
    expect(screen.getByRole('button', { name: /entrar no sistema/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recuperar senha/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar novo usuário com rg/i })).toBeInTheDocument();
    
    // Test language selector and Libras button
    expect(screen.getByRole('button', { name: /selecionar idioma/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /abrir intérprete de libras/i })).toBeInTheDocument();
  });
  
  test('validates CPF field correctly with proper error messages', async () => {
    render(<LoginWithProviders />);
    
    const cpfInput = screen.getByLabelText('Campo CPF');
    
    // Test invalid CPF
    fireEvent.change(cpfInput, { target: { value: '123.456.789-0' } });
    fireEvent.blur(cpfInput);
    
    await waitFor(() => {
      expect(screen.getByText('CPF inválido')).toBeInTheDocument();
      expect(cpfInput).toHaveAttribute('aria-invalid', 'true');
    });
    
    // Test valid CPF
    fireEvent.change(cpfInput, { target: { value: '123.456.789-00' } });
    fireEvent.blur(cpfInput);
    
    await waitFor(() => {
      expect(screen.queryByText('CPF inválido')).not.toBeInTheDocument();
      expect(cpfInput).toHaveAttribute('aria-invalid', 'false');
    });
  });
  
  test('validates password field correctly with proper error messages', () => {
    render(<LoginWithProviders />);
    
    const passwordInput = screen.getByLabelText('Campo Senha');
    
    // Test invalid password (too short)
    fireEvent.change(passwordInput, { target: { value: 'abc' } });
    
    expect(screen.getByText('Senha deve ter pelo menos 8 caracteres, um número e uma letra')).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    
    // Test invalid password (no number)
    fireEvent.change(passwordInput, { target: { value: 'abcdefghijk' } });
    
    expect(screen.getByText('Senha deve ter pelo menos 8 caracteres, um número e uma letra')).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    
    // Test invalid password (no letter)
    fireEvent.change(passwordInput, { target: { value: '12345678' } });
    
    expect(screen.getByText('Senha deve ter pelo menos 8 caracteres, um número e uma letra')).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    
    // Test valid password
    fireEvent.change(passwordInput, { target: { value: 'abc12345' } });
    
    expect(screen.queryByText('Senha deve ter pelo menos 8 caracteres, um número e uma letra')).not.toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('aria-invalid', 'false');
  });
  
  test('login button is disabled until form is valid and shows proper loading state', async () => {
    render(<LoginWithProviders />);
    
    const loginButton = screen.getByRole('button', { name: /entrar no sistema/i });
    const cpfInput = screen.getByLabelText('Campo CPF');
    const passwordInput = screen.getByLabelText('Campo Senha');
    
    // Initially the button should be disabled
    expect(loginButton).toBeDisabled();
    
    // Fill in only CPF - button should still be disabled
    fireEvent.change(cpfInput, { target: { value: '123.456.789-00' } });
    fireEvent.blur(cpfInput);
    
    expect(loginButton).toBeDisabled();
    
    // Fill in valid password - button should be enabled
    fireEvent.change(passwordInput, { target: { value: 'abc12345' } });
    
    await waitFor(() => {
      expect(loginButton).not.toBeDisabled();
    });
    
    // Change to invalid CPF - button should be disabled again
    fireEvent.change(cpfInput, { target: { value: '123.456' } });
    fireEvent.blur(cpfInput);
    
    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });
  });
  
  test('toggle password visibility works with proper ARIA labels', () => {
    render(<LoginWithProviders />);
    
    const passwordInput = screen.getByLabelText('Campo Senha');
    const toggleButton = screen.getByRole('button', { name: /mostrar senha/i });
    
    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-label', 'Mostrar senha');
    
    // Click toggle button to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveAttribute('aria-label', 'Esconder senha');
    
    // Click toggle button again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-label', 'Mostrar senha');
  });
  
  test('successful login flow with proper API integration', async () => {
    const mockToken = 'mock-jwt-token';
    const mockUser = { id: 1, name: 'Test User', role: 'patient' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken, user: mockUser }),
    });

    render(<LoginWithProviders />);
    
    // Fill in valid credentials
    const cpfInput = screen.getByLabelText('Campo CPF');
    const passwordInput = screen.getByLabelText('Campo Senha');
    const loginButton = screen.getByRole('button', { name: /entrar no sistema/i });
    
    fireEvent.change(cpfInput, { target: { value: '123.456.789-00' } });
    fireEvent.blur(cpfInput);
    fireEvent.change(passwordInput, { target: { value: 'abc12345' } });
    
    // Submit form
    fireEvent.click(loginButton);
    
    // Button should show loading state
    expect(screen.getByText('Entrando...')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /carregando/i })).toBeInTheDocument();
    
    await waitFor(() => {
      // Check if token and user data were stored
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
      
      // Check if navigation occurred with replace
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { 
        state: { animation: 'fade' },
        replace: true
      });
    });
  });
  
  test('failed login flow with proper error handling', async () => {
    const errorMessage = 'Credenciais inválidas';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ 
        error: 'INVALID_CREDENTIALS',
        field: 'password',
        message: errorMessage 
      }),
    });

    render(<LoginWithProviders />);
    
    // Fill in valid credentials
    const cpfInput = screen.getByLabelText('Campo CPF');
    const passwordInput = screen.getByLabelText('Campo Senha');
    const loginButton = screen.getByRole('button', { name: /entrar no sistema/i });
    
    fireEvent.change(cpfInput, { target: { value: '123.456.789-00' } });
    fireEvent.blur(cpfInput);
    fireEvent.change(passwordInput, { target: { value: 'abc12345' } });
    
    // Submit form
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      // Check if error message is displayed
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
      
      // Check if navigation did not occur
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
  
  test('handles too many failed attempts correctly', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ 
        error: 'INVALID_CREDENTIALS',
        message: 'Credenciais inválidas' 
      }),
    });

    render(<LoginWithProviders />);
    
    const cpfInput = screen.getByLabelText('Campo CPF');
    const passwordInput = screen.getByLabelText('Campo Senha');
    const loginButton = screen.getByRole('button', { name: /entrar no sistema/i });
    
    // Fill in credentials and attempt login 3 times
    for (let i = 0; i < 3; i++) {
      fireEvent.change(cpfInput, { target: { value: '123.456.789-00' } });
      fireEvent.blur(cpfInput);
      fireEvent.change(passwordInput, { target: { value: 'abc12345' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    }
    
    await waitFor(() => {
      expect(screen.getByText('Muitas tentativas inválidas. Por favor, aguarde 5 minutos.')).toBeInTheDocument();
    });
  });
  
  test('network error handling with proper error display', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<LoginWithProviders />);
    
    const cpfInput = screen.getByLabelText('Campo CPF');
    const passwordInput = screen.getByLabelText('Campo Senha');
    const loginButton = screen.getByRole('button', { name: /entrar no sistema/i });
    
    fireEvent.change(cpfInput, { target: { value: '123.456.789-00' } });
    fireEvent.blur(cpfInput);
    fireEvent.change(passwordInput, { target: { value: 'abc12345' } });
    
    // Submit form
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      // Check if error message is displayed with proper styling
      const errorMessage = screen.getByText('Não foi possível conectar ao servidor');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.closest('div')).toHaveClass('bg-red-50');
      
      // Check if navigation did not occur
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
  
  test('keyboard navigation works correctly', () => {
    render(<LoginWithProviders />);
    
    const cpfInput = screen.getByLabelText('Campo CPF');
    const passwordInput = screen.getByLabelText('Campo Senha');
    const loginButton = screen.getByRole('button', { name: /entrar no sistema/i });
    
    // Start from CPF input
    cpfInput.focus();
    expect(document.activeElement).toBe(cpfInput);
    
    // Tab to password input
    fireEvent.keyDown(cpfInput, { key: 'Tab' });
    expect(document.activeElement).toBe(passwordInput);
    
    // Tab to login button
    fireEvent.keyDown(passwordInput, { key: 'Tab' });
    expect(document.activeElement).toBe(loginButton);
  });
  
  test('cleans up token on mount', () => {
    render(<LoginWithProviders />);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
