import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { FindDoctors } from './pages/find-doctors/find-doctors';
import { NewConsultation } from './pages/video-consult/new-consultation/new-consultation';
import { ConsultConfirm } from './pages/video-consult/consult-confirm/consult-confirm';
import { ConsultCheckout } from './pages/video-consult/consult-checkout/consult-checkout';
import { ConsultSuccess } from './pages/video-consult/consult-success/consult-success';
import { LabTests } from './pages/lab-tests/lab-tests';
import { Surgeries } from './pages/surgeries/surgeries';
import { Register } from './pages/auth/register/register';
import { OtpVerification } from './pages/auth/otp-verification/otp-verification';
import { Login } from './pages/auth/login/login';
import { MyAppointments } from './pages/my-appointments/my-appointments';

import { Checkout } from './pages/lab-tests/checkout/checkout';
import { Payment } from './pages/lab-tests/payment/payment';
import { Success } from './pages/lab-tests/success/success';
import { TestDetail } from './pages/lab-tests/test-detail/test-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'doctors', component: FindDoctors },
  {
    path: 'doctor',
    loadComponent: () => import('./layouts/doctor-layout/doctor-layout').then(m => m.DoctorLayoutComponent),
    children: [
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },
      { path: 'calendar', loadComponent: () => import('./pages/doctor/calendar/calendar').then(m => m.DoctorCalendarComponent) },
      { 
        path: 'patients', 
        loadComponent: () => import('./pages/doctor/patients/patients').then(m => m.DoctorPatientsComponent),
        children: [
          { path: ':id', loadComponent: () => import('./pages/doctor/patients/patient-details/patient-details').then(m => m.PatientDetailsComponent) }
        ]
      },
      { path: 'reports', loadComponent: () => import('./pages/doctor/reports/reports').then(m => m.DoctorReportsComponent) },
      { path: 'profile', loadComponent: () => import('./pages/doctor/profile/profile').then(m => m.DoctorProfileComponent) }
    ]
  },
  { path: 'consult', redirectTo: 'consult/new', pathMatch: 'full' },
  { path: 'consult/new', component: NewConsultation },
  { path: 'consult/payment', component: ConsultConfirm },
  { path: 'consult/checkout', component: ConsultCheckout },
  { path: 'consult/success', component: ConsultSuccess },
  { path: 'tests', component: LabTests },
  { path: 'tests/checkout', component: Checkout },
  { path: 'tests/payment', component: Payment },
  { path: 'tests/success', component: Success },
  { path: 'tests/:id', component: TestDetail },
  { path: 'surgeries', component: Surgeries },
  { path: 'auth/register', component: Register },
  { path: 'auth/verify', component: OtpVerification },
  { path: 'auth/login', component: Login },
  { path: 'appointments', component: MyAppointments }
];


