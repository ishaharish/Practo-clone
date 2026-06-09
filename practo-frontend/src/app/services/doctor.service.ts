import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:5229/api/doctors';

  constructor(private http: HttpClient) { }

  getDoctors(specialty?: string, clinicId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (specialty) {
      params = params.set('specialization', specialty);
    }
    if (clinicId) {
      params = params.set('clinicId', clinicId.toString());
    }
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getDoctorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getDoctorSlots(id: number, date?: string): Observable<any> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<any[]>(`${this.apiUrl}/${id}/slots`, { params }).pipe(
      map(slots => {
        const grouped = {
          morning: [] as any[],
          afternoon: [] as any[],
          evening: [] as any[]
        };

        slots.forEach(slot => {
          // Parse HH:MM:SS
          const [hoursStr] = slot.startTime.split(':');
          const hours = parseInt(hoursStr, 10);

          if (hours < 12) {
            grouped.morning.push(slot);
          } else if (hours >= 12 && hours < 16) {
            grouped.afternoon.push(slot);
          } else {
            grouped.evening.push(slot);
          }
        });

        return grouped;
      })
    );
  }
}


