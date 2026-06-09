import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, map, catchError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5229/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  private loadToken() {
    const token = localStorage.getItem('practo_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Assuming role is stored under a standard claim or 'role'
        const role = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        this.currentUserSubject.next({ ...decoded, role });
      } catch (e) {
        this.logout();
      }
    }
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  verifyOtp(data: any) {
    return this.http.post(`${this.apiUrl}/verify-otp`, data, { responseType: 'text' });
  }

  resendOtp(data: any) {
    return this.http.post(`${this.apiUrl}/resend-otp`, data);
  }

  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('practo_token', response.token);
          this.loadToken();
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('practo_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('practo_token');
  }

  getRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }
}


