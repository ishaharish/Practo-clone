import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-find-doctors',
  imports: [CommonModule],
  templateUrl: './find-doctors.html',
  styleUrl: './find-doctors.css'
})
export class FindDoctors implements OnInit {
  doctors: any[] = [];
  specialty: string = '';
  
  showDropdown = false;
  specialties = [
    'Dentist',
    'Gynecologist/obstetrician',
    'General Physician',
    'Dermatologist',
    'Ear-nose-throat (ent) Specialist',
    'Homoeopath',
    'Ayurveda'
  ];
  
  activeContactId: number | null = null;
  activeBookingId: number | null = null;
  
  slots: any = { morning: [], afternoon: [], evening: [] };
  loadingSlots = false;
  activeTab: 'today' | 'tomorrow' = 'today';

  selectedSlotId: number | null = null;
  selectedSlotTime: string = '';
  bookingError: string | null = null;
  isBooking: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.specialty = params['specialty'] || '';
      this.fetchDoctors();
    });
  }

  hideDropdown() {
    setTimeout(() => { this.showDropdown = false; }, 150);
  }

  selectSpecialty(spec: string) {
    this.specialty = spec;
    this.showDropdown = false;
    this.fetchDoctors();
  }

  fetchDoctors() {
    this.doctorService.getDoctors(this.specialty).subscribe({
      next: (data) => {
        this.doctors = data;
        this.activeContactId = null;
        this.activeBookingId = null;
      },
      error: (err) => console.error('Error fetching doctors:', err)
    });
  }

  getSpecialty(doc: any): string {
    return (doc.specializations && doc.specializations.length > 0) ? doc.specializations[0] : (this.specialty || 'Specialist');
  }

  getClinicName(doc: any): string {
    return (doc.clinics && doc.clinics.length > 0) ? doc.clinics[0].name : 'Clinic';
  }

  getClinicCity(doc: any): string {
    return (doc.clinics && doc.clinics.length > 0) ? doc.clinics[0].city : 'Ernakulam';
  }

  toggleContact(doctorId: number) {
    if (this.activeContactId === doctorId) {
      this.activeContactId = null;
    } else {
      this.activeContactId = doctorId;
    }
  }

  toggleBooking(doctorId: number) {
    if (this.activeBookingId === doctorId) {
      this.activeBookingId = null;
      this.selectedSlotId = null;
      this.bookingError = null;
      this.activeTab = 'today';
    } else {
      this.activeBookingId = doctorId;
      this.selectedSlotId = null;
      this.bookingError = null;
      this.activeTab = 'today';
      this.fetchSlots(doctorId);
    }
  }

  switchTab(tab: 'today' | 'tomorrow') {
    if (this.activeTab === tab || !this.activeBookingId) return;
    this.activeTab = tab;
    this.selectedSlotId = null;
    this.bookingError = null;
    this.fetchSlots(this.activeBookingId);
  }

  fetchSlots(doctorId: number) {
    this.loadingSlots = true;
    
    const targetDate = new Date();
    if (this.activeTab === 'tomorrow') {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    const dateStr = targetDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
    
    this.doctorService.getDoctorSlots(doctorId, dateStr).subscribe({
      next: (data) => {
        this.slots = data;
        this.loadingSlots = false;
      },
      error: (err) => {
        console.error('Error fetching slots:', err);
        this.loadingSlots = false;
      }
    });
  }

  selectSlot(slotId: number, time: string) {
    this.selectedSlotId = slotId;
    this.selectedSlotTime = time;
    this.bookingError = null;
  }

  confirmBooking() {
    if (!this.activeBookingId || !this.selectedSlotId) return;

    this.isBooking = true;
    this.bookingError = null;

    this.appointmentService.bookAppointment(this.activeBookingId, this.selectedSlotId).subscribe({
      next: (res) => {
        this.isBooking = false;
        // Redirect to appointments dashboard on success
        this.router.navigate(['/appointments'], { queryParams: { booked: 'true' } });
      },
      error: (err) => {
        this.isBooking = false;
        if (err.status === 409 || err.status === 400) {
          // Concurrency error or slot already taken
          this.bookingError = "This slot was just booked by another patient. Please select a different time.";
          this.selectedSlotId = null;
          this.fetchSlots(this.activeBookingId!); // Refresh slots
        } else if (err.status === 401) {
          this.bookingError = "Please log in to book an appointment.";
          this.router.navigate(['/auth/login']);
        } else {
          this.bookingError = "An error occurred while booking. Please try again.";
        }
      }
    });
  }
}


