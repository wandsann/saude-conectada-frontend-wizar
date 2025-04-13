import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes CSS usando clsx e tailwind-merge
 * @param inputs Classes CSS a serem combinadas
 * @returns String com as classes combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um CPF
 * @param cpf CPF a ser formatado (apenas números)
 * @returns CPF formatado (xxx.xxx.xxx-xx)
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match && match[1] && match[2] && match[3] && match[4]) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
}

/**
 * Valida um CPF
 * @param cpf CPF a ser validado (apenas números)
 * @returns True se o CPF é válido, false caso contrário
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;
  
  return true;
}

/**
 * Formata um telefone
 * @param phone Telefone a ser formatado (apenas números)
 * @returns Telefone formatado ((xx) xxxxx-xxxx)
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match && match[1] && match[2] && match[3]) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

/**
 * Formata um valor monetário
 * @param value Valor a ser formatado
 * @returns Valor formatado em reais (R$ x.xxx,xx)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma data
 * @param date Data a ser formatada
 * @returns Data formatada (dd/mm/yyyy)
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
}

/**
 * Formata um horário
 * @param date Data a ser formatada
 * @returns Horário formatado (hh:mm)
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Gera um ID único
 * @returns String com ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Trunca um texto
 * @param text Texto a ser truncado
 * @param maxLength Tamanho máximo
 * @returns Texto truncado com reticências
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Retorna o primeiro erro de um objeto de erros
 * @param errors Objeto com erros
 * @returns Primeira mensagem de erro encontrada
 */
export function getFirstError(errors: Record<string, string[]>): string {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return '';
  return errors[firstKey][0] || '';
}

/**
 * Retorna o tamanho formatado de um arquivo
 * @param bytes Tamanho em bytes
 * @returns Tamanho formatado (B, KB, MB, GB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Formata uma data e hora
 * @param date Data a ser formatada
 * @returns Data e hora formatadas (dd/mm/yyyy hh:mm)
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}
