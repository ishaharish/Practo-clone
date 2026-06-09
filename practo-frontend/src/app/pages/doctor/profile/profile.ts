import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class DoctorProfileComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;

  // Step 1: Medical Registration
  registrationData = {
    registrationNumber: '',
    registrationCouncil: '',
    registrationYear: new Date().getFullYear()
  };

  // Step 2 & 3: Establishment Details
  establishmentType = 'own';
  establishmentData = {
    name: '',
    city: '',
    locality: ''
  };

  // Step 4: Identity Proof
  selectedFile: File | null = null;
  uploadSuccess = false;
  doctorProfile: any;

  // Profile View State
  showProfileView = false;
  isEditing = false;
  editData: any = {};

  constructor(private http: HttpClient) { }

  ngOnInit() { 
    this.fetchProfile();
  }

  nextStep() {
    if (this.currentStep === 1) {
      this.submitStep1();
    } else if (this.currentStep === 3) {
      this.submitStep2And3();
    } else if (this.currentStep === 4) {
      this.submitStep4();
    } else {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitStep1() {
    this.http.post(`http://localhost:5229/api/doctors/onboard/step1`, this.registrationData)
      .subscribe({
        next: () => this.currentStep++,
        error: (err) => console.error(err)
      });
  }

  submitStep2And3() {
    const payload = {
      ...this.establishmentData,
      ownEstablishment: this.establishmentType === 'own'
    };
    this.http.post(`http://localhost:5229/api/doctors/onboard/step2`, payload)
      .subscribe({
        next: () => this.currentStep++,
        error: (err) => console.error(err)
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitStep4() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('IdentityProof', this.selectedFile);

    this.http.post(`http://localhost:5229/api/doctors/onboard/upload-proof`, formData)
      .subscribe({
        next: () => {
          this.showProfileView = true;
          this.fetchProfile();
        },
        error: (err) => console.error(err)
      });
  }

  fetchProfile() {
    this.http.get<any>(`http://localhost:5229/api/doctors/profile`)
      .subscribe({
        next: (res) => {
          this.doctorProfile = res;
          // Pre-fill edit data
          this.editData = {
            name: res.name,
            experienceYears: res.experienceYears || 0,
            consultationFee: res.consultationFee || 0,
            biography: res.biography || '',
            qualifications: res.qualifications || ''
          };
          
          // Only show the profile view automatically if they have actually completed onboarding 
          // (which means registrationNumber is filled out)
          if (this.doctorProfile && this.doctorProfile.registrationNumber && !this.uploadSuccess && this.currentStep === 1) {
             this.showProfileView = true;
          }
        },
        error: (err) => console.error(err)
      });
  }

  goToProfile() {
    this.showProfileView = true;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    this.http.put(`http://localhost:5229/api/doctors/profile`, this.editData)
      .subscribe({
        next: () => {
          this.isEditing = false;
          this.fetchProfile();
        },
        error: (err) => console.error(err)
      });
  }
}


