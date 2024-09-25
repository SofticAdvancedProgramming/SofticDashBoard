import { Component, OnInit } from '@angular/core';
import { CompanyCardComponent } from "../../components/company-card/company-card.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../../services/comapnyService/company.service';
import { Company } from '../../../../../models/company';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  imports: [CompanyCardComponent, CommonModule, RouterLink, PaginationModule , CommonModule , FormsModule]
})
export class IndexComponent implements OnInit {
  companies: Company[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies(this.currentPage);
  }

  loadCompanies(page: number): void {
    this.companyService.loadCompanies({
      sortIsAsc: true,
      pageIndex: page,
      pageSize: this.itemsPerPage
    }).subscribe(
      (response: any) => {
        this.companies = response.data.list;
        this.totalItems = response.data.totalRows;
      },
      error => {
        console.error('Error loading companies', error);
      }
    );
  }
  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadCompanies(this.currentPage);
  }
}
