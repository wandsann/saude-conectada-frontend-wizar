
export const validateCPF = (cpf: string): boolean => {
  // Remove non-numeric characters
  const cleanCpf = cpf.replace(/\D/g, '');
  
  // Check if it has 11 digits
  if (cleanCpf.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
  
  // In a real app, we would implement the actual validation algorithm
  // For this demo, we'll just check if it has 11 digits
  return true;
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 number, 1 letter
  return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
};

export const formatCPF = (cpf: string): string => {
  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length <= 3) return cleanCpf;
  if (cleanCpf.length <= 6) return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3)}`;
  if (cleanCpf.length <= 9) return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6)}`;
  return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9, 11)}`;
};

export const validatePhone = (phone: string): boolean => {
  // Remove non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it has between 10 and 11 digits (with or without 9 prefix)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length <= 2) return cleanPhone;
  if (cleanPhone.length <= 6) return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2)}`;
  if (cleanPhone.length <= 10) return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
};
