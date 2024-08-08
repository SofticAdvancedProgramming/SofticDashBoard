import { CustomFormComponent } from './../component/custom-form/custom-form.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-form',
  standalone: true,
  imports: [CommonModule, CustomFormComponent, FormsModule],
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.css']
})
export class MainFormComponent {
  activeTab: string = 'personal';

  personalInfoFields = [
    { label: 'First Name', value: '', placeholder: 'Your First Name' },
    { label: 'Last Name', value: '', placeholder: 'Your Last Name' },
    { label: 'Family Name', value: '', placeholder: 'Your Family Name' },
    { label: 'Gender', value: '', placeholder: 'Type Your Gender' },
    { label: 'Date of Birth', value: '', placeholder: 'Your Date of Birth' },
    { label: 'Marital Status', value: '', placeholder: 'Type Marital Status' },
    { label: 'Nationality', value: '', placeholder: 'Type Your Nationality' },
    { label: 'ID Number', value: '', placeholder: 'Your ID Number' },
    { label: 'Passport Number', value: '', placeholder: 'Your Passport Number' },
    { label: 'Drive License Number', value: '', placeholder: 'Your Drive License Number' }
  ];

  professionalInfoFields = [
    { label: 'Employee ID', value: '', placeholder: 'Employee ID' },
    { label: 'User Name', value: '', placeholder: 'User Name' },
    { label: 'Select Department', value: '', placeholder: 'Select Department' },
    { label: 'Job Title', value: '', placeholder: 'Job Title' },
    { label: 'Supervisor/Manager', value: '', placeholder: '(Name )' },
    { label: 'Joining Date', value: '', placeholder: 'Joining Date' },
    { label: 'Select Office', value: '', placeholder: 'Select Office' },
    { label: 'Business Mobile Number', value: '', placeholder: 'Mobile Number' },
    { label: 'Email Address', value: '', placeholder: 'Email Address' }
  ];

  save() {
    console.log('Form saved!', this.personalInfoFields, this.professionalInfoFields);
  }
}
