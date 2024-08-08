import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-uncompleted-companies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uncompleted-companies.component.html',
  styleUrl: './uncompleted-companies.component.css'
})
export class UncompletedCompaniesComponent {
  companies = [
    { name: 'IOBTE Company', progress: ['segment1', 'segment2', 'segment3'] },
    { name: 'Softic Company', progress: ['segment1', 'segment2', ''] },
    { name: 'Al madany company', progress: ['segment1', 'segment2', 'segment3'] }
  ];
}
