import { Routes } from '@angular/router';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pacientes' },
  { path: 'pacientes', component: PatientListComponent },
  { path: 'pacientes/nuevo', component: PatientFormComponent },
  { path: 'pacientes/editar/:id', component: PatientFormComponent },
  { path: 'pacientes/detalle/:id', component: PatientDetailComponent },
  { path: '**', redirectTo: 'pacientes' }
];
