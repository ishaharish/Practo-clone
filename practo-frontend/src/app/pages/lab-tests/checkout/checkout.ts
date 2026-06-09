import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LabTestCartService } from '../../../services/lab-test.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  currentStep = 1;

  // Step 1: Patient Details
  patientName = '';
  patientAge: number | null = null;
  gender = '';
  mobileNumber = '';
  email = '';

  // Step 2: Address
  pincode = '';
  houseOrFlat = '';
  landmark = '';
  addressType = 'Home';

  // Step 3: Time Slot
  selectedDate = new Date();
  dates: Date[] = [];
  selectedTimeSlot = '';

  morningSlots = ['06:00 AM - 06:30 AM', '06:30 AM - 07:00 AM', '07:00 AM - 07:30 AM', '07:30 AM - 08:00 AM', '08:00 AM - 08:30 AM', '08:30 AM - 09:00 AM', '09:00 AM - 09:30 AM', '09:30 AM - 10:00 AM', '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM', '11:00 AM - 11:30 AM', '11:30 AM - 12:00 PM'];
  afternoonSlots = ['12:00 PM - 12:30 PM', '12:30 PM - 01:00 PM', '01:00 PM - 01:30 PM', '01:30 PM - 02:00 PM', '02:00 PM - 02:30 PM', '02:30 PM - 03:00 PM'];
  eveningSlots = ['03:00 PM - 03:30 PM', '03:30 PM - 04:00 PM', '04:00 PM - 04:30 PM', '04:30 PM - 05:00 PM', '05:00 PM - 05:30 PM', '05:30 PM - 06:00 PM', '06:00 PM - 06:30 PM'];

  constructor(
    public cartService: LabTestCartService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.cartService.getCart().length === 0) {
      this.router.navigate(['/tests']);
    }
    
    // Generate next 3 dates
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i + 1); // Start from tomorrow
      this.dates.push(d);
    }
    this.selectedDate = this.dates[0];
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (!this.patientName || !this.patientAge || !this.gender || !this.mobileNumber || !this.email) {
        alert('Please fill all patient details');
        return;
      }
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      if (!this.pincode || !this.houseOrFlat || !this.landmark) {
        alert('Please fill all address details');
        return;
      }
      this.currentStep = 3;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  selectDate(d: Date) {
    this.selectedDate = d;
    this.selectedTimeSlot = ''; // Reset slot when date changes
  }

  selectTimeSlot(slot: string) {
    this.selectedTimeSlot = slot;
  }

  proceedToPayment(paymentType: string) {
    if (!this.selectedTimeSlot) {
      alert('Please select a time slot');
      return;
    }

    // Save checkout data to a service or state, then navigate
    // We'll just pass it via router state for simplicity
    const checkoutData = {
      patientName: this.patientName,
      patientAge: this.patientAge,
      gender: this.gender,
      mobileNumber: this.mobileNumber,
      email: this.email,
      pincode: this.pincode,
      houseOrFlat: this.houseOrFlat,
      landmark: this.landmark,
      bookingDate: this.selectedDate.toISOString().split('T')[0],
      timeSlot: this.selectedTimeSlot,
      paymentType: paymentType // 'pay_now' or 'pay_at_pickup'
    };

    if (paymentType === 'pay_now') {
      this.router.navigate(['/tests/payment'], { state: { checkoutData } });
    } else {
      // Pay at pickup: directly confirm booking
      this.router.navigate(['/tests/payment'], { state: { checkoutData, skipPayment: true } });
    }
  }
}


