import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PatientService } from './services/patient.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly patientService = inject(PatientService);

  readonly capacityMessage = this.patientService.capacityMessage;
  readonly isAtCapacity = this.patientService.isAtCapacity;
}
