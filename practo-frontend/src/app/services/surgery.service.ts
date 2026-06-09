import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SurgeryType {
  id: number;
  name: string;
  description: string;
  category: string;
  estimatedCost: number;
}

export interface SurgeryEnquiryDto {
  name: string;
  phoneNumber: string;
  city: string;
  surgeryTypeId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SurgeryService {
  private apiUrl = 'http://localhost:5229/api/surgeries';

  constructor(private http: HttpClient) { }

  getSurgeryTypes(): Observable<SurgeryType[]> {
    return this.http.get<SurgeryType[]>(this.apiUrl);
  }

  submitEnquiry(enquiry: SurgeryEnquiryDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/enquiry`, enquiry);
  }
}


