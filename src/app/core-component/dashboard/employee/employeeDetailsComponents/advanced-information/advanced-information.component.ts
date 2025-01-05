import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AddressComponent } from './address/address.component';
import { SocialComponent } from './social/social.component';
import { MedicalInsuranceComponent } from './medical-insurance/medical-insurance.component';
import { HighSchoolComponent } from './education/education.component';
import { JobExperienceComponent } from './job-experience/job-experience.component';
import { AdditionalEducationComponent } from './additional-education/additional-education.component';
import { UserSkillsComponent } from './user-skills/user-skills.component';
import { UserAttachmentsComponent } from './user-attachments/user-attachments.component';
import { UserContractComponent } from './user-contract/user-contract.component';
import { EmployeeTypeComponent } from "./type/employee-type/employee-type.component";

@Component({
  selector: 'app-advanced-information',
  standalone: true,
  templateUrl: './advanced-information.component.html',
  styleUrl: './advanced-information.component.css',
  imports: [
    CommonModule,
    AddressComponent,
    SocialComponent,
    MedicalInsuranceComponent,
    HighSchoolComponent,
    JobExperienceComponent,
    AdditionalEducationComponent,
    UserSkillsComponent,
    UserAttachmentsComponent,
    UserContractComponent,
    EmployeeTypeComponent
]
})
export class AdvancedInformationComponent {
  constructor(private router: Router) {}

  currentSlide = 0;
  slides = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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

  get isArabic():boolean{
    return localStorage.getItem('lang')==='ar';
  }
}
