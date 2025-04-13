
export interface User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  birthDate: string;
  phone?: string;
  photoUrl?: string;
  points: number;
}

export interface Appointment {
  id: string;
  date: string;
  specialty: string;
  doctorName: string;
  status: 'scheduled' | 'completed' | 'canceled';
}

export interface ConsultationHistory {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  specialty: string;
}

export interface Symptom {
  id: string;
  name: string;
  isSelected?: boolean;
}

export interface VitalSign {
  id: string;
  name: string;
  value: number | null;
  unit: string;
  min: number;
  max: number;
}
