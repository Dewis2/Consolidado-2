import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { PatientFormValue } from '../../models/patient.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './patient-form.component.html'
})
export class PatientFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly patientService = inject(PatientService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly patientId = this.route.snapshot.paramMap.get('id');
  private readonly currentPatient = this.patientId ? this.patientService.getById(this.patientId) : undefined;

  readonly isEditMode = signal(!!this.currentPatient);
  readonly isAtCapacity = this.patientService.isAtCapacity;
  readonly formMessage = signal<{ type: 'success' | 'danger' | 'warning'; text: string } | null>(null);

  readonly form = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    edad: [null as number | null, [Validators.required, Validators.min(0), Validators.max(120)]],
    sexo: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    diagnostico: ['', [Validators.required, Validators.minLength(5)]],
    fechaIngreso: ['', [Validators.required]]
  });

  constructor() {
    if (this.patientId && !this.currentPatient) {
      this.formMessage.set({ type: 'danger', text: 'No se encontró el paciente que intentas editar.' });
      return;
    }

    if (this.currentPatient) {
      this.form.patchValue({
        dni: this.currentPatient.dni,
        nombres: this.currentPatient.nombres,
        apellidos: this.currentPatient.apellidos,
        edad: this.currentPatient.edad,
        sexo: this.currentPatient.sexo,
        telefono: this.currentPatient.telefono,
        direccion: this.currentPatient.direccion,
        diagnostico: this.currentPatient.diagnostico,
        fechaIngreso: this.currentPatient.fechaIngreso
      });
    }

    if (!this.isEditMode() && this.isAtCapacity()) {
      this.form.disable();
      this.formMessage.set({ type: 'warning', text: 'No es posible registrar más pacientes. El aforo está completo.' });
    }
  }

  get title(): string {
    return this.isEditMode() ? 'Editar paciente' : 'Registrar paciente';
  }

  fieldError(field: keyof PatientFormValue): string {
    const control = this.form.get(field);
    if (!control || !control.errors || (!control.touched && !control.dirty)) return '';

    if (control.errors['required']) return 'Este campo es obligatorio.';
    if (control.errors['minlength']) return `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
    if (control.errors['pattern']) {
      if (field === 'dni') return 'El DNI debe tener exactamente 8 dígitos numéricos.';
      if (field === 'telefono') return 'El teléfono debe tener exactamente 9 dígitos numéricos.';
      return 'Formato inválido.';
    }
    if (control.errors['min']) return `El valor mínimo es ${control.errors['min'].min}.`;
    if (control.errors['max']) return `El valor máximo es ${control.errors['max'].max}.`;

    return 'Campo inválido.';
  }

  save(): void {
    this.formMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formMessage.set({ type: 'danger', text: 'Corrige los errores del formulario antes de continuar.' });
      return;
    }

    const payload = this.form.getRawValue() as PatientFormValue;

    const duplicatedDni = this.patientService.existsDni(payload.dni, this.currentPatient?.id);
    if (duplicatedDni) {
      this.formMessage.set({ type: 'danger', text: 'El DNI ingresado ya pertenece a otro paciente.' });
      return;
    }

    const result = this.isEditMode() && this.currentPatient
      ? this.patientService.update(this.currentPatient.id, payload)
      : this.patientService.create(payload);

    if (!result.ok) {
      this.formMessage.set({ type: 'danger', text: result.message });
      return;
    }

    this.router.navigate(['/pacientes'], {
      state: { flash: { type: 'success', text: result.message } }
    });
  }
}
