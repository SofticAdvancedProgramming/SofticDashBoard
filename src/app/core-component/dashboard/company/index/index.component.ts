import { Component, OnInit } from '@angular/core';
import { CompanyCardComponent } from "../../components/company-card/company-card.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../../services/comapnyService/company.service';
import { Company } from '../../../../../models/company';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  imports: [CompanyCardComponent, CommonModule, RouterLink]
})
export class IndexComponent implements OnInit {
  companies: Company[] = [];

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.loadCompanies({ sortIsAsc: true, pageSize: 40 }).subscribe(
      (response: any) => {
        console.log(response)
        this.companies = response.data.list
      }
    );
  }
}
