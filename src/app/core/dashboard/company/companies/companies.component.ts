import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyCardComponent } from '../../components/company-card/company-card.component';


@Component({
  selector: 'app-companies',
  standalone: true,
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
  imports: [CommonModule, CompanyCardComponent]
})
export class CompaniesComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
