import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consult-success',
  imports: [CommonModule],
  template: `
  <div class="bg-[#1b2559] min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl p-10 max-w-md w-full text-center relative overflow-hidden">
      
      <!-- Pulsing Animation -->
      <div class="relative w-32 h-32 mx-auto mb-8">
        <div class="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
        <div class="absolute inset-2 bg-practo-blue rounded-full animate-pulse opacity-40"></div>
        <div class="absolute inset-4 bg-white rounded-full shadow-inner flex items-center justify-center z-10">
          <svg class="w-10 h-10 text-practo-blue animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-practo-text mb-4">Connecting you...</h2>
      <p class="text-practo-muted mb-8 text-sm">We are connecting you with the next available specialist in your requested queue.</p>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded p-4 mb-8">
        <p class="text-xs font-semibold text-yellow-700">Please do not close this window or press back.</p>
      </div>

      <button (click)="goToDashboard()" class="text-practo-blue font-semibold hover:underline text-sm">
        Return to My Appointments
      </button>

    </div>
  </div>
  `
})
export class ConsultSuccess implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // In a real app, this page would establish a WebSocket connection and listen for a doctor joining.
  }

  goToDashboard() {
    this.router.navigate(['/appointments']);
  }
}


