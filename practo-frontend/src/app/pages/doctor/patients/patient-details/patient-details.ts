import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-details.html',
  styleUrls: ['./patient-details.css']
})
export class PatientDetailsComponent implements OnInit {
  patientId: number | null = null;
  patientData: any = null;
  
  // Clinical Form
  clinicalForm = {
    diagnosis: '',
    prescription: '',
    symptoms: ''
  };

  // Next Visit
  nextVisit = {
    date: '',
    time: ''
  };

  showToast = false;
  toastMessage = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('PatientDetailsComponent initialized!');
    this.route.paramMap.subscribe(params => {
      console.log('paramMap triggered:', params);
      const id = params.get('id');
      console.log('Extracted ID:', id);
      if (id) {
        this.patientId = Number(id);
        this.fetchPatientTimeline();
      } else {
        console.error('No ID found in paramMap!');
      }
    });

    this.route.params.subscribe(p => {
      console.log('params triggered:', p);
    });

    // Default Next Visit to tomorrow 10 AM
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    this.nextVisit.date = tmrw.toISOString().split('T')[0];
    this.nextVisit.time = '10:00';
  }

  errorMessage: any = null;

  fetchPatientTimeline() {
    console.log(`Fetching timeline for patient ID: ${this.patientId}`);
    this.errorMessage = null;
    this.http.get<any>(`http://localhost:5229/api/doctors/dashboard/patients/${this.patientId}`)
      .subscribe({
        next: (res) => {
          console.log('Received patient data:', res);
          this.patientData = res;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load patient data', err);
          this.errorMessage = err;
          this.displayToast('Error loading patient data');
        }
      });
  }

  saveClinicalRecord() {
    if (!this.patientData?.timeline || this.patientData.timeline.length === 0) {
      this.displayToast('No active appointment to attach clinical records to!');
      return;
    }

    const latestApptId = this.patientData.timeline[0].id; // Attach to the most recent appointment

    const payload = {
      appointmentId: latestApptId,
      diagnosis: this.clinicalForm.diagnosis,
      prescription: this.clinicalForm.prescription
    };

    this.http.post(`http://localhost:5229/api/appointments/${latestApptId}/medical-record`, payload)
      .subscribe({
        next: () => {
          this.displayToast('Clinical record saved successfully!');
          this.clinicalForm = { diagnosis: '', prescription: '', symptoms: '' };
          this.fetchPatientTimeline();
        },
        error: (err) => {
          console.error(err);
          this.displayToast('Failed to save record. It might already exist.');
        }
      });
  }

  deletePatient() {
    if (confirm('Are you sure you want to delete this patient and all of their historical records? This cannot be undone.')) {
      this.http.delete(`http://localhost:5229/api/doctors/dashboard/patients/${this.patientId}`)
        .subscribe({
          next: () => {
            this.displayToast('Patient deleted successfully!');
            // Route back to parent to refresh the list and clear the right pane
            setTimeout(() => {
              // The parent component isn't automatically refreshed via router.navigate unless we trick it,
              // or we can reload the window for a quick demo fix, or navigate to a dummy route.
              // For a simple fix, let's navigate to the parent route.
              // But since we want the parent to fetchPatients again, the simplest way for a prototype is window.location
              window.location.href = '/doctor/patients';
            }, 1000);
          },
          error: (err) => {
            console.error(err);
            this.displayToast('Failed to delete patient.');
          }
        });
    }
  }

  scheduleNextVisit() {
    if (!this.nextVisit.date || !this.nextVisit.time) {
      this.displayToast('Please select a valid date and time.');
      return;
    }

    const localDateTimeStr = `${this.nextVisit.date}T${this.nextVisit.time}:00`;

    const payload = {
      patientId: this.patientId,
      nextVisitDate: localDateTimeStr
    };

    this.http.post('http://localhost:5229/api/ray/appointments/next-visit', payload)
      .subscribe({
        next: () => {
          this.displayToast('Next visit scheduled and added to calendar!');
          this.fetchPatientTimeline();
        },
        error: (err) => {
          console.error(err);
          this.displayToast('Failed to schedule next visit.');
        }
      });
  }

  displayToast(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }
}


