import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-consult',
  imports: [],
  templateUrl: './video-consult.html',
  styleUrl: './video-consult.css'
})
export class VideoConsult {
  constructor(private router: Router) {}

  consultSpecialty(specialty: string) {
    this.router.navigate(['/doctors'], { queryParams: { specialty, videoOnly: true } });
  }
}


