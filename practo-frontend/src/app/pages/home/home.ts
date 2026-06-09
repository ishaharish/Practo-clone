import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  showDropdown = false;
  
  specialties = [
    'Dentist',
    'Gynecologist/obstetrician',
    'General Physician',
    'Dermatologist',
    'Ear-nose-throat (ent) Specialist',
    'Homoeopath',
    'Ayurveda'
  ];

  constructor(private router: Router) {}

  toggleDropdown() {
    this.showDropdown = true;
  }

  hideDropdown() {
    // Slight delay to allow click event to fire on the list item before hiding
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  selectSpecialty(spec: string) {
    this.router.navigate(['/doctors'], { queryParams: { specialty: spec } });
  }
}


