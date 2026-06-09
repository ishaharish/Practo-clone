import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideoConsultService } from '../../../services/video-consult.service';

@Component({
  selector: 'app-consult-checkout',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="bg-[#1b2559] text-white p-4 rounded-t-lg flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button (click)="goBack()" class="text-white hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <span class="font-bold text-lg">Amount to Pay: ₹{{consultData?.fee}}</span>
        </div>
        <span class="text-sm opacity-90">{{consultData?.patientName}}</span>
      </div>

      <div class="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 flex flex-col md:flex-row min-h-[500px]">
        
        <!-- Sidebar -->
        <div class="md:w-1/3 border-r border-gray-100 bg-gray-50">
          <div class="p-4 font-bold text-practo-text border-b border-gray-200">
            Payment Options
          </div>
          <ul class="flex flex-col">
            <li class="p-4 border-l-4 border-practo-blue bg-white font-medium text-practo-text cursor-pointer">Debit / Credit Card</li>
            <li class="p-4 text-gray-500 hover:bg-white cursor-pointer border-l-4 border-transparent">UPI</li>
            <li class="p-4 text-gray-500 hover:bg-white cursor-pointer border-l-4 border-transparent">Google Pay</li>
            <li class="p-4 text-gray-500 hover:bg-white cursor-pointer border-l-4 border-transparent">Net Banking</li>
          </ul>
        </div>

        <!-- Main Area -->
        <div class="md:w-2/3 p-8 flex flex-col justify-center items-center">
          
          <div *ngIf="errorMsg" class="w-full bg-red-100 text-red-700 p-3 rounded mb-6 text-sm font-semibold text-center">
            {{ errorMsg }}
          </div>

          <div class="w-full max-w-md border border-gray-200 rounded-xl p-6 relative bg-white shadow-sm mb-6">
            <div class="absolute top-4 right-4">
              <svg class="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
            </div>
            
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
              <input type="text" placeholder="XXXX - XXXX - XXXX - XXXX" class="w-full border-none p-0 focus:ring-0 text-lg tracking-widest text-practo-text font-mono">
              <div class="h-px w-full bg-gray-200 mt-1"></div>
            </div>

            <div class="mb-6">
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Card Holder's Name</label>
              <input type="text" placeholder="Eg: John Doe" class="w-full border-none p-0 focus:ring-0 text-practo-text font-medium">
              <div class="h-px w-full bg-gray-200 mt-1"></div>
            </div>

            <div class="flex gap-6">
              <div class="flex-1">
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Valid Upto</label>
                <input type="text" placeholder="MM / YY" class="w-full border-none p-0 focus:ring-0 text-practo-text font-mono">
                <div class="h-px w-full bg-gray-200 mt-1"></div>
              </div>
              <div class="flex-1">
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Enter CVV</label>
                <input type="password" placeholder="***" class="w-full border-none p-0 focus:ring-0 text-practo-text font-mono">
                <div class="h-px w-full bg-gray-200 mt-1"></div>
              </div>
            </div>
          </div>

          <p class="text-xs text-gray-400 mb-6 text-center">Your transactions are 100% secure</p>

          <button (click)="pay()" [disabled]="isProcessing" class="w-full max-w-md bg-green-500 text-white font-bold py-3 px-8 rounded disabled:opacity-50 hover:bg-green-600 transition-colors shadow-md">
            {{ isProcessing ? 'Processing...' : 'Pay ₹' + consultData?.fee }}
          </button>
        </div>
      </div>
    </div>
  </div>
  `
})
export class ConsultCheckout implements OnInit {
  consultData: any;
  isProcessing = false;
  errorMsg = '';

  constructor(private router: Router, private service: VideoConsultService) {}

  ngOnInit() {
    const data = sessionStorage.getItem('consultData');
    if (!data) {
      this.router.navigate(['/consult/new']);
      return;
    }
    this.consultData = JSON.parse(data);
  }

  goBack() {
    this.router.navigate(['/consult/payment']);
  }

  pay() {
    this.isProcessing = true;
    this.errorMsg = '';

    const payload = {
      specialty: this.consultData.specialty,
      amountPaid: this.consultData.fee,
      patientName: this.consultData.patientName,
      patientPhoneNumber: this.consultData.mobile
    };

    this.service.joinQueue(payload).subscribe({
      next: (res) => {
        sessionStorage.removeItem('consultData');
        this.router.navigate(['/consult/success']);
      },
      error: (err) => {
        this.errorMsg = err.error || 'Payment failed. Please try again.';
        this.isProcessing = false;
      }
    });
  }
}


