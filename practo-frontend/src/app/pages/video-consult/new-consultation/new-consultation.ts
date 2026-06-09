import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideoConsultService, VideoConsultPricing } from '../../../services/video-consult.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-new-consultation',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        
        <!-- Form Section -->
        <div class="p-8 md:w-3/5 border-r border-gray-100">
          <h1 class="text-2xl font-bold text-practo-text mb-6">Consult with a Doctor</h1>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tell us your symptom or health problem</label>
              <textarea [(ngModel)]="symptom" rows="2" class="w-full border border-gray-300 rounded p-3 focus:ring-practo-blue focus:border-practo-blue" placeholder="Eg: fever, headache"></textarea>
              <p class="text-xs text-gray-500 mt-1">Min 4 characters</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Choose a relevant speciality</label>
              <div class="space-y-2">
                <div *ngFor="let p of pricing" class="flex items-center justify-between border border-gray-200 rounded p-3 cursor-pointer hover:bg-gray-50" (click)="selectedSpecialty = p">
                  <div class="flex items-center gap-3">
                    <div class="w-5 h-5 rounded-full border border-practo-blue flex items-center justify-center" [class.bg-practo-blue]="selectedSpecialty === p">
                      <div class="w-2 h-2 rounded-full bg-white" *ngIf="selectedSpecialty === p"></div>
                    </div>
                    <span class="text-practo-text text-sm font-medium">{{p.specialty}}</span>
                  </div>
                  <span class="text-practo-text font-semibold text-sm">₹{{p.fee}}</span>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mobile number</label>
              <div class="flex">
                <span class="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l">
                  +91
                </span>
                <input type="tel" [(ngModel)]="mobileNumber" class="w-full border border-gray-300 rounded-r p-3 focus:ring-practo-blue focus:border-practo-blue">
              </div>
            </div>

            <button (click)="continue()" [disabled]="!isValid()" class="bg-practo-blue text-white font-bold py-3 px-8 rounded disabled:opacity-50 hover:bg-blue-800 transition-colors">
              Continue
            </button>
          </div>
        </div>

        <!-- Trust Section -->
        <div class="p-8 md:w-2/5 flex flex-col items-center justify-center bg-gray-50">
          <div class="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <svg class="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h3 class="font-bold text-lg text-practo-text">Private & Secure</h3>
        </div>
      </div>
    </div>
  </div>
  `
})
export class NewConsultation implements OnInit {
  pricing: VideoConsultPricing[] = [];
  selectedSpecialty: VideoConsultPricing | null = null;
  symptom = '';
  mobileNumber = '';

  constructor(
    private service: VideoConsultService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.service.getPricing().subscribe(data => {
      this.pricing = data;
      if (data.length > 0) {
        this.selectedSpecialty = data[0];
      }
    });

    if (this.authService.isLoggedIn()) {
      this.mobileNumber = '9876543210'; // In a real app, pull from User profile
    }
  }

  isValid() {
    return this.symptom.length >= 4 && this.selectedSpecialty && this.mobileNumber.length >= 10;
  }

  continue() {
    if (this.isValid()) {
      // Store in session storage to pass to next step
      sessionStorage.setItem('consultData', JSON.stringify({
        symptom: this.symptom,
        specialty: this.selectedSpecialty?.specialty,
        fee: this.selectedSpecialty?.fee,
        mobile: this.mobileNumber
      }));
      this.router.navigate(['/consult/payment']);
    }
  }
}


