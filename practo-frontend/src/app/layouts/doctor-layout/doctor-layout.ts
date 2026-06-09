import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctor-layout.html',
  styleUrls: ['./doctor-layout.css']
})
export class DoctorLayoutComponent {
}


