import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LabTestService, LabTest, LabTestCartService } from '../../services/lab-test.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lab-tests',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lab-tests.html',
  styleUrl: './lab-tests.css'
})
export class LabTests implements OnInit {
  labTests: LabTest[] = [];
  individualTests: LabTest[] = [];
  packageTests: LabTest[] = [];
  
  isCartOpen = false;

  constructor(
    private labTestService: LabTestService,
    public cartService: LabTestCartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.labTestService.getLabTests().subscribe(tests => {
      this.labTests = tests;
      this.individualTests = tests.filter(t => t.category === 'Individual');
      this.packageTests = tests.filter(t => t.category === 'Package');
    });
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  openBookingModal() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/tests' } });
      return;
    }
    if (this.cartService.getCart().length > 0) {
      this.router.navigate(['/tests/checkout']);
    }
  }
}


