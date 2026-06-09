import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-consult-confirm',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        
        <!-- Details Section -->
        <div class="p-8 md:w-3/5 border-r border-gray-100">
          <div class="flex items-center gap-4 mb-6">
            <button (click)="goBack()" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <h1 class="text-2xl font-bold text-practo-text">Confirm & Pay</h1>
          </div>
          
          <div class="mb-6">
            <p class="text-sm text-gray-600 mb-2">Verified {{consultData?.specialty}}s online now <span class="inline-block w-2 h-2 rounded-full bg-green-500 ml-1"></span></p>
            <div class="flex -space-x-2 overflow-hidden mb-2">
              <img class="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=Doc+1&background=random" alt="">
              <img class="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=Doc+2&background=random" alt="">
              <img class="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://ui-avatars.com/api/?name=Doc+3&background=random" alt="">
              <div class="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white bg-gray-100 text-xs text-gray-500">+168</div>
            </div>
            <p class="text-sm font-medium text-practo-text mb-4">One of them will speak to you shortly.</p>
            
            <ul class="space-y-2 text-sm text-practo-muted">
              <li class="flex items-center gap-2"><svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> 93% of users found online consultation helpful</li>
              <li class="flex items-center gap-2"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg> Consultation will happen via video</li>
            </ul>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Consulting For</label>
            <div class="flex gap-4 mb-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="forWhom" [(ngModel)]="consultingFor" value="myself" class="text-practo-blue focus:ring-practo-blue">
                <span class="text-sm text-practo-text">Myself</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="forWhom" [(ngModel)]="consultingFor" value="someoneElse" class="text-practo-blue focus:ring-practo-blue">
                <span class="text-sm text-practo-text">Someone Else</span>
              </label>
            </div>
            
            <label class="block text-sm font-medium text-gray-700 mb-1">Patient name</label>
            <input type="text" [(ngModel)]="patientName" class="w-full border border-gray-300 rounded p-3 focus:ring-practo-blue focus:border-practo-blue" [placeholder]="consultingFor === 'myself' ? 'Your Name' : 'Enter patient name'">
          </div>

          <div class="mb-6">
            <p class="text-sm text-gray-500 mb-1">Final Fee</p>
            <p class="text-2xl font-bold text-practo-text">₹{{consultData?.fee}}</p>
          </div>

          <button (click)="continue()" [disabled]="!patientName" class="bg-practo-blue text-white font-bold py-3 px-8 rounded disabled:opacity-50 hover:bg-blue-800 transition-colors w-full md:w-auto">
            Continue to payment
          </button>
        </div>

        <!-- Banner Section -->
        <div class="p-8 md:w-2/5 flex flex-col items-center justify-center bg-gray-50 text-center">
          <div class="w-24 h-24 mb-6">
            <svg class="w-full h-full text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 6h20v12H2V6zm2 2v8h16V8H4zm6 2h4v4h-4v-4zm-2 0H6v4h2v-4zm8 0h-2v4h2v-4z"/>
            </svg>
          </div>
          <h3 class="font-bold text-lg text-practo-text mb-2">3x more affordable!</h3>
          <p class="text-sm text-practo-muted">Get affordable healthcare online, with fees upto 3 times lesser than in clinic fees.</p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ConsultConfirm implements OnInit {
  consultData: any;
  consultingFor = 'myself';
  patientName = ''; 

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const data = sessionStorage.getItem('consultData');
    if (!data) {
      this.router.navigate(['/consult/new']);
      return;
    }
    this.consultData = JSON.parse(data);

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.patientName = user.name || user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User';
      }
    });
  }

  goBack() {
    this.router.navigate(['/consult/new']);
  }

  continue() {
    this.consultData.patientName = this.patientName;
    sessionStorage.setItem('consultData', JSON.stringify(this.consultData));
    this.router.navigate(['/consult/checkout']);
  }
}


