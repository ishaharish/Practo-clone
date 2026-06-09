import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-doctor-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class DoctorReportsComponent implements OnInit {
  stats = {
    totalAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0
  };
  
  revenueDetails: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchReports();
  }

  fetchReports() {
    this.http.get<any>(`http://localhost:5229/api/ray/reports`)
      .subscribe({
        next: (res) => {
          this.stats = {
            totalAppointments: res.totalAppointments || res.TotalAppointments || 0,
            completedAppointments: res.completedAppointments || res.CompletedAppointments || 0,
            totalRevenue: res.totalRevenue || res.TotalRevenue || 0
          };
          this.revenueDetails = res.revenueDetails || res.RevenueDetails || [];
          console.log('Stats fetched successfully:', this.stats, this.revenueDetails);
          this.cdr.detectChanges(); // Force UI update immediately
        },
        error: (err) => {
          console.error('Failed to fetch reports:', err);
        }
      });
  }
}


