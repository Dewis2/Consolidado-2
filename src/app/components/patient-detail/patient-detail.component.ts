import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './patient-detail.component.html'
})
export class PatientDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly patientService = inject(PatientService);

  readonly patient = this.patientService.getById(this.route.snapshot.paramMap.get('id') ?? '');
}
