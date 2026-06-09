import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LabTestService, LabTest, LabTestCartService } from '../../../services/lab-test.service';

@Component({
  selector: 'app-test-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './test-detail.html',
  styleUrl: './test-detail.css',
})
export class TestDetail implements OnInit {
  test: LabTest | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private labTestService: LabTestService,
    public cartService: LabTestCartService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.labTestService.getLabTest(+id).subscribe({
          next: (data: LabTest) => {
            this.test = data;
            this.loading = false;
          },
          error: (err: any) => {
            console.error('Error fetching test detail', err);
            this.loading = false;
          }
        });
      }
    });
  }
}


