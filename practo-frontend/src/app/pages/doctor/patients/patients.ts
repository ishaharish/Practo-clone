import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './patients.html',
  styleUrls: ['./patients.css']
})
export class DoctorPatientsComponent implements OnInit {
  patients: any[] = [];
  selectedPatientId: number | null = null;

  showAddModal = false;
  
  newPatient = {
    fullName: '',
    mobile: '',
    gender: 'Other',
    age: null
  };

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchPatients();
    
    // Track selected patient from route to highlight sidebar
    this.router.events.subscribe(() => {
      const child = this.route.firstChild;
      if (child) {
        child.paramMap.subscribe(params => {
          this.selectedPatientId = Number(params.get('id'));
        });
      } else {
        this.selectedPatientId = null;
      }
    });
  }

  fetchPatients() {
    this.http.get<any[]>(`http://localhost:5229/api/doctors/dashboard/patients`)
      .subscribe({
        next: (res) => {
          this.patients = res;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
  }

  selectPatient(patientId: number) {
    this.router.navigate([patientId], { relativeTo: this.route });
  }

  toggleAddModal() {
    this.showAddModal = !this.showAddModal;
    if (!this.showAddModal) {
      this.resetForm();
    }
  }

  submitPatient() {
    if (!this.newPatient.fullName || !this.newPatient.mobile) return;

    this.http.post('http://localhost:5229/api/doctors/dashboard/patients', this.newPatient)
      .subscribe({
        next: (res: any) => {
          this.toggleAddModal();
          this.fetchPatients();
          // Optionally auto-select the new patient
          if (res.patientId) {
            this.selectPatient(res.patientId);
          }
        },
        error: (err) => console.error(err)
      });
  }

  resetForm() {
    this.newPatient = {
      fullName: '',
      mobile: '',
      gender: 'Other',
      age: null
    };
  }
}


