import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VideoConsultPricing {
  specialty: string;
  fee: number;
}

export interface VideoConsultQueue {
  specialty: string;
  amountPaid: number;
  patientName: string;
  patientPhoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoConsultService {
  private apiUrl = 'http://localhost:5229/api/consultations';

  constructor(private http: HttpClient) { }

  getPricing(): Observable<VideoConsultPricing[]> {
    return this.http.get<VideoConsultPricing[]>(`${this.apiUrl}/pricing`);
  }

  joinQueue(request: VideoConsultQueue): Observable<any> {
    return this.http.post(`${this.apiUrl}/queue`, request);
  }
}


