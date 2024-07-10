import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-active-companies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-companies.component.html',
  styleUrl: './active-companies.component.css'
})
export class ActiveCompaniesComponent {
  companies = ['IOBTE Company', 'Al madany Company', 'QNP Company'];

}
