import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class DoctorCalendarComponent implements OnInit {
  appointments: any[] = [];
  doctors: any[] = [];
  categories: any[] = [];
  
  // State
  currentDate = new Date();
  weekDays: Date[] = [];
  calendarHours: string[] = [];
  
  selectedDoctorId: number | null = null;
  
  // Drag and Drop State
  isDragging = false;
  draggedAppointment: any = null;
  dragStartY = 0;
  dragStartTop = 0;

  // Walk-in Modal State
  showWalkInModal = false;
  walkInForm: any = {
    patientName: '',
    patientMobile: '',
    patientEmail: '',
    abhaId: '',
    doctorId: null,
    categoryId: null,
    bookingDate: '',
    bookingTime: '',
    durationMinutes: 30,
    plannedProcedures: '',
    internalNotes: '',
    notifyPatientSms: false,
    notifyPatientEmail: false
  };

  // Appointment Details Modal State
  showAppointmentDetails = false;
  selectedAppointment: any = null;

  // Reschedule Modal State
  showRescheduleModal = false;
  rescheduleData: any = null;

  // Toast Notification State
  showToast = false;
  toastMessage = '';

  // Queue tracking state
  queueMetrics = {
    today: 0,
    waiting: 0,
    engaged: 0,
    done: 0
  };

  // View State
  currentView: 'Day' | 'Week' | 'Month' = 'Week';
  monthDays: Date[] = [];

  constructor(private http: HttpClient) {
    this.generateDays();
    this.generateTimeSlots();
  }

  ngOnInit() {
    this.fetchDoctors();
    this.fetchAppointments();
    // Fetch categories for sidebar and modal
  }

  setView(view: 'Day' | 'Week' | 'Month') {
    this.currentView = view;
    this.generateDays();
    this.fetchAppointments();
  }

  previous() {
    if (this.currentView === 'Day') this.currentDate.setDate(this.currentDate.getDate() - 1);
    else if (this.currentView === 'Week') this.currentDate.setDate(this.currentDate.getDate() - 7);
    else if (this.currentView === 'Month') this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    
    this.currentDate = new Date(this.currentDate);
    this.generateDays();
    this.fetchAppointments();
  }

  next() {
    if (this.currentView === 'Day') this.currentDate.setDate(this.currentDate.getDate() + 1);
    else if (this.currentView === 'Week') this.currentDate.setDate(this.currentDate.getDate() + 7);
    else if (this.currentView === 'Month') this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    
    this.currentDate = new Date(this.currentDate);
    this.generateDays();
    this.fetchAppointments();
  }

  setToday() {
    this.currentDate = new Date();
    this.generateDays();
    this.fetchAppointments();
  }

  getDateRangeText() {
    if (this.currentView === 'Day') {
      return this.currentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    } else if (this.currentView === 'Week' && this.weekDays.length > 0) {
      const start = this.weekDays[0];
      const end = this.weekDays[6];
      return `${start.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    } else {
      return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  }

  fetchDoctors() {
    this.http.get<any[]>('http://localhost:5229/api/doctors')
      .subscribe({
        next: (res) => {
          this.doctors = res;
        },
        error: (err) => console.error(err)
      });
  }

  get todayAppointments() {
    const todayStr = this.currentDate.toDateString();
    const todayList = this.appointments.filter(a => new Date(a.bookingDate).toDateString() === todayStr);
    
    // Deduplicate in case of accidental double clicks or backend join issues
    const uniqueList = [];
    const seen = new Set();
    for (const appt of todayList) {
      if (!seen.has(appt.id)) {
        seen.add(appt.id);
        uniqueList.push(appt);
      }
    }
    return uniqueList;
  }

  ngAfterViewInit() {
    // Smooth scroll to current time
    setTimeout(() => {
      const container = document.getElementById('calendar-scroll-box');
      if (container) {
        const currentYOffset = this.calculateCurrentTimeYOffset();
        container.scrollTo({ top: currentYOffset - 100, behavior: 'smooth' });
      }
    }, 500);
  }

  generateDays() {
    if (this.currentView === 'Day') {
      this.weekDays = [new Date(this.currentDate)];
    } else if (this.currentView === 'Week') {
      const startOfWeek = new Date(this.currentDate);
      startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
      this.weekDays = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        this.weekDays.push(day);
      }
    } else if (this.currentView === 'Month') {
      const startOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
      const startDay = startOfMonth.getDay();
      
      const startGrid = new Date(startOfMonth);
      startGrid.setDate(startGrid.getDate() - startDay);
      
      this.monthDays = [];
      for (let i = 0; i < 35; i++) {
        const day = new Date(startGrid);
        day.setDate(startGrid.getDate() + i);
        this.monthDays.push(day);
      }
    }
  }

  generateTimeSlots() {
    for (let i = 8; i <= 20; i++) {
      const hour = i > 12 ? i - 12 : i;
      const ampm = i >= 12 ? 'PM' : 'AM';
      this.calendarHours.push(`${hour}:00 ${ampm}`);
    }
  }

  fetchAppointments() {
    let start, end;
    if (this.currentView === 'Month') {
      if (this.monthDays.length === 0) return;
      start = this.monthDays[0].toISOString();
      end = this.monthDays[this.monthDays.length - 1].toISOString();
    } else {
      if (this.weekDays.length === 0) return;
      start = this.weekDays[0].toISOString();
      end = this.weekDays[this.weekDays.length - 1].toISOString();
    }
    
    let url = `http://localhost:5229/api/ray/calendar?startDate=${start}&endDate=${end}`;
    if (this.selectedDoctorId) {
      url += `&specificDoctorId=${this.selectedDoctorId}`;
    }

    this.http.get<any[]>(url)
      .subscribe({
        next: (res) => {
          this.appointments = res;
          this.calculateQueueMetrics();
        },
        error: (err) => console.error(err)
      });
  }

  calculateQueueMetrics() {
    const todayStr = this.currentDate.toDateString();
    const todayAppts = this.appointments.filter(a => new Date(a.bookingDate).toDateString() === todayStr);
    
    this.queueMetrics.today = todayAppts.length;
    this.queueMetrics.waiting = todayAppts.filter(a => a.queueStatus === 'Waiting').length; // Waiting
    this.queueMetrics.engaged = todayAppts.filter(a => a.queueStatus === 'Engaged').length; // Engaged
    this.queueMetrics.done = todayAppts.filter(a => a.queueStatus === 'Done').length; // Done
  }

  getAppointmentsForDay(day: Date) {
    const dayStr = day.toDateString();
    return this.appointments.filter(a => new Date(a.bookingDate).toDateString() === dayStr);
  }

  isToday(day: Date) {
    return day.toDateString() === new Date().toDateString();
  }

  calculateTopOffset(dateString: string): number {
    // 64px = 1 hour, starting from 8 AM (which is offset 0 ideally, or we map 00:00 to 0)
    // Let's assume the grid starts at 8 AM.
    const d = new Date(dateString);
    // Convert to IST assuming it's UTC from DB.
    // For simplicity of prototype, use local hours
    const hours = d.getHours();
    const minutes = d.getMinutes();
    
    const minutesFrom8AM = ((hours - 8) * 60) + minutes;
    return (minutesFrom8AM / 60) * 64; // 64px per hour
  }

  calculateCardHeight(durationMinutes: number): number {
    return (durationMinutes / 60) * 64; // 64px per hour
  }

  calculateCurrentTimeYOffset(): number {
    const d = new Date();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const minutesFrom8AM = ((hours - 8) * 60) + minutes;
    return (minutesFrom8AM / 60) * 64;
  }

  getCategoryColorClass(categoryId: number) {
    const colors = [
      'bg-blue-500 bg-opacity-15 border-blue-500', 
      'bg-green-500 bg-opacity-15 border-green-500', 
      'bg-purple-500 bg-opacity-15 border-purple-500'
    ];
    return colors[(categoryId || 0) % colors.length];
  }

  trackByAppointmentId(index: number, item: any): number {
    return item.id;
  }

  // --- DRAG AND DROP ---
  onDragStart(event: MouseEvent, appt: any) {
    event.preventDefault();
    this.isDragging = true;
    this.draggedAppointment = appt;
    this.dragStartY = event.clientY;
    
    // Store original time
    this.dragStartTop = this.calculateTopOffset(appt.bookingDate);
  }

  @HostListener('mousemove', ['$event'])
  onDragMove(event: MouseEvent) {
    if (!this.isDragging || !this.draggedAppointment) return;
    
    const deltaY = event.clientY - this.dragStartY;
    const newTop = this.dragStartTop + deltaY;
    
    // Visually move it immediately (we would typically update a local temporary property)
    // For now, we wait for mouseup to process.
  }

  @HostListener('mouseup', ['$event'])
  onDragEnd(event: MouseEvent) {
    if (!this.isDragging || !this.draggedAppointment) return;
    this.isDragging = false;
    
    const deltaY = event.clientY - this.dragStartY;
    
    if (Math.abs(deltaY) < 10) {
      // It's a click, show details
      this.selectedAppointment = this.draggedAppointment;
      this.showAppointmentDetails = true;
      this.draggedAppointment = null;
      return; 
    }

    // Calculate new time and Snap to nearest 15 minutes
    const deltaHours = deltaY / 64;
    const deltaMs = deltaHours * 60 * 60 * 1000;
    
    const originalDate = new Date(this.draggedAppointment.bookingDate);
    const rawNewDate = new Date(originalDate.getTime() + deltaMs);
    const msPer15Min = 15 * 60 * 1000;
    const newDate = new Date(Math.round(rawNewDate.getTime() / msPer15Min) * msPer15Min);
    
    // Block past drop operations
    if (newDate < new Date()) {
      alert("Cannot reschedule appointments to a past time.");
      // Snaps back automatically because we don't save the state
      this.draggedAppointment = null;
      return;
    }

    // Open Custom Reschedule Modal
    this.rescheduleData = {
      appointment: this.draggedAppointment,
      originalDate: originalDate,
      newDate: newDate,
      notifyPatientViaSms: false,
      notifyPatientViaEmail: false,
      notifyDoctorViaSms: false,
      notifyDoctorViaEmail: false
    };
    
    this.showRescheduleModal = true;
    this.draggedAppointment = null;
  }

  confirmReschedule() {
    if (!this.rescheduleData) return;

    const newDate = this.rescheduleData.newDate;
    const localDateStr = `${newDate.getFullYear()}-${(newDate.getMonth()+1).toString().padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')}`;
    const newTimeSpan = `${newDate.getHours().toString().padStart(2, '0')}:${newDate.getMinutes().toString().padStart(2, '0')}:00`;
      
    this.http.put(`http://localhost:5229/api/ray/appointments/${this.rescheduleData.appointment.id}/reschedule`, {
      newDate: localDateStr,
      newStartTime: newTimeSpan,
      notifyPatient: this.rescheduleData.notifyPatientViaEmail || this.rescheduleData.notifyPatientViaSms,
      notifyDoctor: this.rescheduleData.notifyDoctorViaEmail || this.rescheduleData.notifyDoctorViaSms
    }).subscribe({
      next: () => {
        this.fetchAppointments();
        this.closeRescheduleModal();
        this.displayToast('Successfully updated appointment');
      },
      error: (err) => alert("Failed to reschedule")
    });
  }

  closeRescheduleModal() {
    this.showRescheduleModal = false;
    this.rescheduleData = null;
  }

  deleteAppointment(id: number) {
    if (confirm("Are you sure you want to completely delete this appointment?")) {
      this.http.delete(`http://localhost:5229/api/ray/appointments/${id}`)
        .subscribe({
          next: () => {
            this.fetchAppointments();
            this.displayToast('Appointment deleted');
          },
          error: (err) => alert("Failed to delete appointment")
        });
    }
  }

  markAsDone(id: number) {
    this.http.put(`http://localhost:5229/api/ray/appointments/${id}/mark-done`, {})
      .subscribe({
        next: () => {
          this.fetchAppointments();
          this.displayToast('Appointment marked as Completed!');
        },
        error: (err) => alert("Failed to update status")
      });
  }

  displayToast(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  // --- WALK IN MODAL ---
  openWalkInModal() {
    this.showWalkInModal = true;
    this.walkInForm.bookingDate = new Date().toISOString().split('T')[0];
    const d = new Date();
    d.setMinutes(d.getMinutes() + 15);
    this.walkInForm.bookingTime = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  closeWalkInModal() {
    this.showWalkInModal = false;
  }

  submitWalkIn() {
    // Combine date and time without converting to UTC timezone
    const localDateTimeStr = `${this.walkInForm.bookingDate}T${this.walkInForm.bookingTime}:00`;
    const payload = { ...this.walkInForm, bookingDate: localDateTimeStr };
    
    // Default doctor ID to first available doctor if not selected
    if (!payload.doctorId && this.doctors.length > 0) {
      payload.doctorId = this.doctors[0].id;
    }

    this.http.post('http://localhost:5229/api/ray/appointments/walk-in', payload)
      .subscribe({
        next: (res: any) => {
          this.closeWalkInModal();
          this.fetchAppointments();
          this.displayToast(res?.message || 'Walk-in appointment successfully booked!');
          
          // Reset form for next time
          this.walkInForm = {
            patientName: '',
            patientMobile: '',
            patientEmail: '',
            abhaId: '',
            doctorId: null,
            categoryId: null,
            bookingDate: '',
            bookingTime: '',
            durationMinutes: 30,
            plannedProcedures: '',
            internalNotes: '',
            notifyPatientSms: false,
            notifyPatientEmail: false
          };
        },
        error: (err) => {
          console.error(err);
          this.displayToast('Error: Could not save the appointment.');
        }
      });
  }

  closeAppointmentDetails() {
    this.showAppointmentDetails = false;
    this.selectedAppointment = null;
  }
}


