import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:5229/api/appointments';

  constructor(private http: HttpClient) { }

  getMyAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  bookAppointment(doctorId: number, slotId: number, symptoms: string = ''): Observable<any> {
    const payload = { doctorId, slotId, symptoms };
    return this.http.post<any>(this.apiUrl, payload);
  }
}


