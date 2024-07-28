import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [    CommonModule,
    FormsModule,
    RouterModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent {
  cards = Array.from({ length: 3 }, (_, i) => ({
    title: `UI UX Designer ${i + 1}`,
    department: 'Designing Department'
  }));
  active: boolean = true;
}
