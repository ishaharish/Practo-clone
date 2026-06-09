import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LabTestService, LabTestCartService } from '../../../services/lab-test.service';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit {
  checkoutData: any;
  loading = false;
  paymentMethod = 'card';

  // Card details mock
  cardNumber = '';
  expiry = '';
  cvv = '';

  constructor(
    private router: Router,
    private labTestService: LabTestService,
    public cartService: LabTestCartService
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.['checkoutData']) {
      this.checkoutData = nav.extras.state['checkoutData'];
    }
  }

  ngOnInit() {
    if (!this.checkoutData && history.state.checkoutData) {
      this.checkoutData = history.state.checkoutData;
    }
    
    if (!this.checkoutData) {
      this.router.navigate(['/tests']);
      return;
    }

    if (history.state.skipPayment) {
      this.processBooking();
    }
  }

  processBooking() {
    if (this.paymentMethod === 'card' && (!this.cardNumber || !this.expiry || !this.cvv)) {
      alert('Please fill in card details');
      return;
    }

    this.loading = true;
    const booking = {
      labTestIds: this.cartService.getCart().map(t => t.id),
      homeCollection: true,
      address: `${this.checkoutData.houseOrFlat}, ${this.checkoutData.landmark}, ${this.checkoutData.pincode}`,
      ...this.checkoutData
    };

    this.labTestService.bookLabTest(booking).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/tests/success']);
      },
      error: (err) => {
        console.error(err);
        alert('Booking failed. Please try again.');
        this.loading = false;
      }
    });
  }
}


