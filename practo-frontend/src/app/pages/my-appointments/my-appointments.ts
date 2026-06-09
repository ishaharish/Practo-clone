import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-my-appointments',
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div *ngIf="showSuccess" class="mb-6 bg-green-50 text-green-700 p-4 rounded-md border border-green-200 flex items-center gap-2 font-medium">
        <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Your appointment was booked successfully!
      </div>

      <h1 class="text-3xl font-bold text-practo-text mb-8 border-b pb-4">My Appointments</h1>

      <div *ngIf="loading" class="text-center py-10 text-practo-muted">
        <svg class="animate-spin h-8 w-8 text-practo-blue mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        Loading your appointments...
      </div>

      <div *ngIf="!loading && appointments.length === 0" class="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <h3 class="text-xl font-bold text-gray-500 mb-2">No Appointments Yet</h3>
        <p class="text-gray-400">You haven't booked any clinic visits yet.</p>
      </div>

      <div *ngIf="!loading && appointments.length > 0" class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-sm text-practo-muted uppercase tracking-wider">
              <th class="p-4 font-semibold">Date & Time</th>
              <th class="p-4 font-semibold">Doctor</th>
              <th class="p-4 font-semibold">Clinic</th>
              <th class="p-4 font-semibold">Status</th>
              <th class="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let apt of appointments" class="hover:bg-gray-50 transition-colors">
              <td class="p-4">
                <p class="font-bold text-practo-text">{{ apt?.slotDate | date:'mediumDate' }}</p>
                <p class="text-sm text-practo-muted">{{ apt?.startTime | slice:0:5 }}</p>
              </td>
              <td class="p-4">
                <p class="font-bold text-practo-blue">{{ apt?.doctorName }}</p>
                <p class="text-xs text-practo-muted mt-0.5">Consultation</p>
              </td>
              <td class="p-4">
                <p class="text-sm text-practo-text flex items-center gap-1">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  {{ apt?.clinicName }}
                </p>
              </td>
              <td class="p-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center" 
                      [ngClass]="{'bg-yellow-100 text-yellow-800': apt.status === 'Pending', 'bg-green-100 text-green-800': apt.status === 'Confirmed', 'bg-gray-100 text-gray-800': apt.status === 'Completed', 'bg-red-100 text-red-800': apt.status === 'Cancelled'}">
                  {{ apt.status }}
                </span>
              </td>
              <td class="p-4 text-right">
                <button class="text-practo-blue text-sm font-semibold hover:underline mr-4">View</button>
                <button *ngIf="apt.status === 'Pending' || apt.status === 'Confirmed'" class="text-red-500 text-sm font-semibold hover:underline">Cancel</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MyAppointments implements OnInit {
  appointments: any[] = [];
  loading = true;
  showSuccess = false;

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['booked'] === 'true') {
        this.showSuccess = true;
        setTimeout(() => this.showSuccess = false, 5000);
      }
    });

    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        this.appointments = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching appointments', err);
        this.appointments = [];
        this.loading = false;
      }
    });
  }
}


