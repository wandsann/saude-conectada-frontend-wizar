/**
 * Valida um CPF
 * @param cpf CPF a ser validado (com ou sem pontuação)
 * @returns true se o CPF é válido, false caso contrário
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Calcula os dígitos verificadores
  let sum = 0;
  let remainder;

  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

/**
 * Valida uma senha
 * @param password Senha a ser validada
 * @returns true se a senha é válida, false caso contrário
 */
export const validatePassword = (password: string): boolean => {
  // Mínimo 8 caracteres, pelo menos 1 letra e 1 número
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
};

export const formatCPF = (cpf: string): string => {
  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length <= 3) return cleanCpf;
  if (cleanCpf.length <= 6) return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3)}`;
  if (cleanCpf.length <= 9) return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6)}`;
  return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9, 11)}`;
};

/**
 * Valida um telefone
 * @param phone Telefone a ser validado (com ou sem pontuação)
 * @returns true se o telefone é válido, false caso contrário
 */
export const validatePhone = (phone: string): boolean => {
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');

  // Verifica se tem 11 dígitos (incluindo DDD) e começa com 9
  return /^[1-9]{2}9\d{8}$/.test(cleanPhone);
};

export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length <= 2) return cleanPhone;
  if (cleanPhone.length <= 6) return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2)}`;
  if (cleanPhone.length <= 10) return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
};

/**
 * Valida um e-mail
 * @param email E-mail a ser validado
 * @returns true se o e-mail é válido, false caso contrário
 */
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
