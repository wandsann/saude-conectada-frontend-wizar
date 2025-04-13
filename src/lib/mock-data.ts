
import { User, Appointment, ConsultationHistory, Symptom, VitalSign } from './types';

export const mockUser: User = {
  id: '1',
  name: 'Maria Silva',
  cpf: '123.456.789-00',
  email: 'maria.silva@exemplo.com',
  birthDate: '1985-06-15',
  phone: '(11) 98765-4321',
  photoUrl: '/placeholder.svg',
  points: 45
};

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: '2025-04-20T10:00:00',
    specialty: 'Cardiologia',
    doctorName: 'Dr. Carlos Cardoso',
    status: 'scheduled'
  },
  {
    id: '2',
    date: '2025-04-25T15:30:00',
    specialty: 'Dermatologia',
    doctorName: 'Dra. Ana Pele',
    status: 'scheduled'
  }
];

export const mockConsultationHistory: ConsultationHistory[] = [
  {
    id: '1',
    date: '2025-03-10T14:00:00',
    doctorName: 'Dr. Roberto Geral',
    diagnosis: 'Gripe',
    specialty: 'Clínica Geral'
  },
  {
    id: '2',
    date: '2025-02-15T09:30:00',
    doctorName: 'Dra. Patrícia Ossos',
    diagnosis: 'Tendinite',
    specialty: 'Ortopedia'
  },
  {
    id: '3',
    date: '2025-01-22T11:00:00',
    doctorName: 'Dr. Marcos Coração',
    diagnosis: 'Pressão alta',
    specialty: 'Cardiologia'
  }
];

export const mockSymptoms: Symptom[] = [
  { id: '1', name: 'Dor de cabeça' },
  { id: '2', name: 'Febre' },
  { id: '3', name: 'Tosse' },
  { id: '4', name: 'Dor de garganta' },
  { id: '5', name: 'Coriza' },
  { id: '6', name: 'Falta de ar' },
  { id: '7', name: 'Dor no corpo' },
  { id: '8', name: 'Cansaço' },
  { id: '9', name: 'Náusea' },
  { id: '10', name: 'Diarreia' },
  { id: '11', name: 'Dor abdominal' },
  { id: '12', name: 'Perda de apetite' },
  { id: '13', name: 'Tontura' },
  { id: '14', name: 'Dor no peito' },
  { id: '15', name: 'Formigamento' }
];

export const mockVitalSigns: VitalSign[] = [
  { id: '1', name: 'Pressão arterial', value: null, unit: 'mmHg', min: 80, max: 200 },
  { id: '2', name: 'Saturação', value: null, unit: '%', min: 50, max: 100 },
  { id: '3', name: 'Temperatura', value: null, unit: '°C', min: 34, max: 42 },
  { id: '4', name: 'Batimentos', value: null, unit: 'bpm', min: 40, max: 200 }
];
