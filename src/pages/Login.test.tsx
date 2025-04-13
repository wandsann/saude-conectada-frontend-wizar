
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

// Wrapper component to provide necessary context
const LoginWithProviders = () => (
  <BrowserRouter>
    <ToastProvider>
      <Login />
    </ToastProvider>
  </BrowserRouter>
);

describe('Login Component', () => {
  test('renders login form with required elements', () => {
    render(<LoginWithProviders />);
    
    // Test logo and title
    expect(screen.getByText('Saúde Conectada')).toBeInTheDocument();
    
    // Test form fields
    expect(screen.getByLabelText('Campo CPF')).toBeInTheDocument();
    expect(screen.getByLabelText('Campo Senha')).toBeInTheDocument();
    
    // Test buttons
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /esqueci minha senha/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar com rg/i })).toBeInTheDocument();
    
    // Test language selector and Libras button
    expect(screen.getByRole('button', { name: /mudar idioma/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /abrir intérprete de libras/i })).toBeInTheDocument();
  });
  
  test('validates CPF field correctly', async () => {
    render(<LoginWithProviders />);
    
    const cpfInput = screen.getByLabelText('Campo CPF');
    
    // Test invalid CPF
    fireEvent.change(cpfInput, { target: { value: '123.456.789-0' } });
    fireEvent.blur(cpfInput);
    
    await waitFor(() => {
      expect(screen.getByText('CPF inválido')).toBeInTheDocument();
    });
    
    // Test valid CPF
    fireEvent.change(cpfInput, { target: { value: '123.456.789-00' } });
    fireEvent.blur(cpfInput);
    
    await waitFor(() => {
      expect(screen.queryByText('CPF inválido')).not.toBeInTheDocument();
    });
  });
  
  test('validates password field correctly', () => {
    render(<LoginWithProviders />);
    
    const passwordInput = screen.getByLabelText('Campo Senha');
    
    // Test invalid password (too short)
    fireEvent.change(passwordInput, { target: { value: 'abc' } });
    
    expect(screen.getByText('Senha deve ter pelo menos 8 caracteres, um número e uma letra')).toBeInTheDocument();
    
    // Test invalid password (no number)
    fireEvent.change(passwordInput, { target: { value: 'abcdefghijk' } });
    
    expect(screen.getByText('Senha deve ter pelo menos 8 caracteres, um número e uma letra')).toBeInTheDocument();
    
    // Test invalid password (no letter)
    fireEvent.change(passwordInput, { target: { value: '12345678' } });
    
    expect(screen.getByText('Senha deve ter pelo menos 8 caracteres, um número e uma letra')).toBeInTheDocument();
    
    // Test valid password
    fireEvent.change(passwordInput, { target: { value: 'abc12345' } });
    
    expect(screen.queryByText('Senha deve ter pelo menos 8 caracteres, um número e uma letra')).not.toBeInTheDocument();
  });
  
  test('login button is disabled until form is valid', async () => {
    render(<LoginWithProviders />);
    
    const loginButton = screen.getByRole('button', { name: /entrar/i });
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
  
  test('toggle password visibility works', () => {
    render(<LoginWithProviders />);
    
    const passwordInput = screen.getByLabelText('Campo Senha');
    const toggleButton = screen.getByRole('button', { name: /mostrar senha/i });
    
    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle button to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click toggle button again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
  
  test('LibrasToggle opens dialog when clicked', async () => {
    render(<LoginWithProviders />);
    
    const librasButton = screen.getByRole('button', { name: /abrir intérprete de libras/i });
    
    fireEvent.click(librasButton);
    
    await waitFor(() => {
      expect(screen.getByText('Intérprete de Libras')).toBeInTheDocument();
    });
  });
});
