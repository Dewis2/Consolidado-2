export interface Patient {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  edad: number;
  sexo: 'Masculino' | 'Femenino' | 'Otro';
  telefono: string;
  direccion: string;
  diagnostico: string;
  fechaIngreso: string;
  createdAt: string;
  updatedAt: string;
}

export type PatientFormValue = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;
