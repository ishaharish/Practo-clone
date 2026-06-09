import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurgeryService, SurgeryType } from '../../services/surgery.service';

@Component({
  selector: 'app-surgeries',
  imports: [CommonModule, FormsModule],
  templateUrl: './surgeries.html',
  styleUrl: './surgeries.css'
})
export class Surgeries implements OnInit {
  surgeryTypes: SurgeryType[] = [];
  filteredSurgeries: SurgeryType[] = [];
  categories: string[] = [];
  activeCategory = 'All';

  enquiryForm = {
    name: '',
    phoneNumber: '',
    city: 'Bangalore',
    surgeryTypeId: null as number | null
  };

  isSubmitting = false;
  showSuccessModal = false;
  successMessage = '';
  errorMessage = '';

  constructor(private surgeryService: SurgeryService) {}

  ngOnInit() {
    this.surgeryService.getSurgeryTypes().subscribe(types => {
      this.surgeryTypes = types;
      this.filteredSurgeries = types;
      
      const cats = new Set(types.map(t => t.category));
      this.categories = ['All', ...Array.from(cats)];
    });
  }

  filterByCategory(category: string) {
    this.activeCategory = category;
    if (category === 'All') {
      this.filteredSurgeries = this.surgeryTypes;
    } else {
      this.filteredSurgeries = this.surgeryTypes.filter(t => t.category === category);
    }
  }

  submitEnquiry() {
    // Basic validation
    if (!this.enquiryForm.name || !this.enquiryForm.phoneNumber || !this.enquiryForm.city || !this.enquiryForm.surgeryTypeId) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(this.enquiryForm.phoneNumber)) {
      this.errorMessage = 'Please enter a valid 10-digit phone number.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      name: this.enquiryForm.name,
      phoneNumber: this.enquiryForm.phoneNumber,
      city: this.enquiryForm.city,
      surgeryTypeId: this.enquiryForm.surgeryTypeId
    };

    this.surgeryService.submitEnquiry(payload).subscribe({
      next: (res) => {
        this.showSuccessModal = true;
        this.isSubmitting = false;
        // Reset form
        this.enquiryForm = { name: '', phoneNumber: '', city: 'Bangalore', surgeryTypeId: null };
      },
      error: (err) => {
        this.errorMessage = err.error?.title || err.error || 'Failed to submit enquiry.';
        this.isSubmitting = false;
      }
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}


