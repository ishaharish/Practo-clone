import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LabTest {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  reportTime: string;
  category: string;
  testCount: number;
}

export interface LabTestBookingDto {
  labTestIds: number[];
  bookingDate: string;
  homeCollection: boolean;
  address: string;
  patientName: string;
  patientAge: number;
  gender: string;
  mobileNumber: string;
  email: string;
  pincode: string;
  houseOrFlat: string;
  landmark: string;
  timeSlot: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabTestService {
  private apiUrl = 'http://localhost:5229/api/labtests';

  constructor(private http: HttpClient) { }

  getLabTests(): Observable<LabTest[]> {
    return this.http.get<LabTest[]>(this.apiUrl);
  }

  getLabTest(id: number): Observable<LabTest> {
    return this.http.get<LabTest>(`${this.apiUrl}/${id}`);
  }

  bookLabTest(booking: LabTestBookingDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/book`, booking);
  }
}
@Injectable({
  providedIn: 'root'
})
export class LabTestCartService {
  private cartItems: LabTest[] = [];

  addToCart(test: LabTest) {
    if (!this.cartItems.find(t => t.id === test.id)) {
      this.cartItems.push(test);
    }
  }

  removeFromCart(testId: number) {
    this.cartItems = this.cartItems.filter(t => t.id !== testId);
  }

  isInCart(testId: number): boolean {
    return this.cartItems.some(t => t.id === testId);
  }

  getCart(): LabTest[] {
    return this.cartItems;
  }

  getCartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  clearCart() {
    this.cartItems = [];
  }
}


