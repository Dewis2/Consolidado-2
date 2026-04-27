import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './patient-list.component.html'
})
export class PatientListComponent implements OnInit {
  private readonly patientService = inject(PatientService);
  private readonly router = inject(Router);

  readonly patients = this.patientService.patients;
  readonly isAtCapacity = this.patientService.isAtCapacity;
  readonly message = signal<{ type: 'success' | 'danger' | 'warning'; text: string } | null>(null);
  readonly hasPatients = computed(() => this.patients().length > 0);

  ngOnInit(): void {
    const flash = history.state?.flash as { type: 'success' | 'danger' | 'warning'; text: string } | undefined;
    if (flash?.text) {
      this.message.set(flash);
    }
  }

  removePatient(id: string, fullName: string): void {
    const confirmed = window.confirm(`¿Seguro que deseas eliminar al paciente ${fullName}?`);
    if (!confirmed) return;

    const result = this.patientService.delete(id);
    this.message.set({ type: result.ok ? 'success' : 'danger', text: result.message });
  }

  clearMessage(): void {
    this.message.set(null);
  }

  navigateToNew(): void {
    if (this.isAtCapacity()) {
      this.message.set({ type: 'warning', text: 'No se puede registrar: aforo máximo de 10 pacientes alcanzado.' });
      return;
    }

    this.router.navigate(['/pacientes/nuevo']);
  }
}
