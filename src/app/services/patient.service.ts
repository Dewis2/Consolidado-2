import { Injectable, computed, signal } from '@angular/core';
import { Patient, PatientFormValue } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly storageKey = 'hospital-dr-sano-patients';
  readonly maxPatients = 10;

  private readonly _patients = signal<Patient[]>(this.loadPatients());

  readonly patients = computed(() => this._patients());
  readonly patientCount = computed(() => this._patients().length);
  readonly capacityMessage = computed(
    () => `Pacientes registrados: ${this.patientCount()} / ${this.maxPatients}`
  );
  readonly isAtCapacity = computed(() => this.patientCount() >= this.maxPatients);

  getById(id: string): Patient | undefined {
    return this._patients().find((patient) => patient.id === id);
  }

  existsDni(dni: string, excludedId?: string): boolean {
    return this._patients().some(
      (patient) => patient.dni === dni && patient.id !== excludedId
    );
  }

  create(data: PatientFormValue): { ok: boolean; message: string } {
    if (this.isAtCapacity()) {
      return { ok: false, message: 'No se puede registrar: aforo máximo alcanzado (10 pacientes).' };
    }

    if (this.existsDni(data.dni)) {
      return { ok: false, message: 'No se puede registrar: el DNI ya existe.' };
    }

    const now = new Date().toISOString();
    const newPatient: Patient = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };

    this._patients.update((current) => [...current, newPatient]);
    this.persist();

    return { ok: true, message: 'Paciente registrado exitosamente.' };
  }

  update(id: string, data: PatientFormValue): { ok: boolean; message: string } {
    const patient = this.getById(id);
    if (!patient) {
      return { ok: false, message: 'Paciente no encontrado.' };
    }

    if (this.existsDni(data.dni, id)) {
      return { ok: false, message: 'No se puede guardar: el DNI pertenece a otro paciente.' };
    }

    const updatedPatient: Patient = {
      ...patient,
      ...data,
      updatedAt: new Date().toISOString()
    };

    this._patients.update((current) =>
      current.map((item) => (item.id === id ? updatedPatient : item))
    );
    this.persist();

    return { ok: true, message: 'Paciente actualizado correctamente.' };
  }

  delete(id: string): { ok: boolean; message: string } {
    const patient = this.getById(id);
    if (!patient) {
      return { ok: false, message: 'Paciente no encontrado.' };
    }

    this._patients.update((current) => current.filter((item) => item.id !== id));
    this.persist();

    return { ok: true, message: 'Paciente eliminado correctamente.' };
  }

  private loadPatients(): Patient[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as Patient[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this._patients()));
  }
}
