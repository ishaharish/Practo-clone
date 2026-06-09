import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-otp-verification',
  imports: [FormsModule, CommonModule],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css'
})
export class OtpVerification implements OnInit {
  otpCode = '';
  email = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  onSubmit() {
    if (!this.otpCode || this.otpCode.length !== 6 || !this.email) {
      this.error = 'Please enter a valid 6-digit OTP and ensure email is provided.';
      return;
    }

    this.loading = true;
    this.error = '';

    const payload = {
      email: this.email,
      otpCode: this.otpCode,
      purpose: 'Registration'
    };

    this.authService.verifyOtp(payload).subscribe({
      next: (res) => {
        // Redirect to Login on success
        this.router.navigate(['/auth/login'], { queryParams: { verified: 'true' } });
      },
      error: (err) => {
        this.error = err.error?.message || 'Verification failed. Invalid or expired OTP.';
        this.loading = false;
      }
    });
  }

  onResend(event: Event) {
    event.preventDefault();
    if (!this.email) return;

    this.loading = true;
    this.error = '';

    this.authService.resendOtp({ email: this.email }).subscribe({
      next: () => {
        this.error = 'A new OTP has been sent to your email!';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to resend OTP.';
        this.loading = false;
      }
    });
  }
}


