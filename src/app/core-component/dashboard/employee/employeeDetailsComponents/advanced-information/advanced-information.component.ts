import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AddressComponent } from "./address/address.component";
import { SocialComponent } from "./social/social.component";
import { MedicalInsuranceComponent } from "./medical-insurance/medical-insurance.component";
import { HighSchoolComponent } from "./education/education.component";

@Component({
    selector: 'app-advanced-information',
    standalone: true,
    templateUrl: './advanced-information.component.html',
    styleUrl: './advanced-information.component.css',
    imports: [CommonModule, AddressComponent, SocialComponent, MedicalInsuranceComponent, HighSchoolComponent]
})
export class AdvancedInformationComponent {
  constructor(private router: Router) {}

  currentSlide = 0; 
  slides = [0, 1 ,2,3] ;  

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }
}
