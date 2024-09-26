import { Component, OnInit } from '@angular/core';
import { CompanyCardComponent } from "../../components/company-card/company-card.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../../services/comapnyService/company.service';
import { Company } from '../../../../../models/company';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { debounce } from 'lodash';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  imports: [CompanyCardComponent, CommonModule, RouterLink, PaginationModule, CommonModule, FormsModule]
})
export class IndexComponent implements OnInit {
  companies: Company[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchDataValue: any = '';
  private debounceSearchWithDiscount: (() => void) | any;

  constructor(private companyService: CompanyService) {
    this.debounceSearchWithDiscount = debounce(this.searchData.bind(this), 1000);
  }

  ngOnInit(): void {
    this.loadCompanies(this.currentPage);
  }

  loadCompanies(page: number, query = {}): void {
    this.companyService.loadCompanies({
      sortIsAsc: true,
      pageIndex: page,
      pageSize: this.itemsPerPage,
      ...query
    }).subscribe(
      (response: any) => {
        this.companies = response.data.list;
        this.totalItems = response.data.totalRows;
      }
    );
  }

  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadCompanies(this.currentPage);
  }

  public searchData(value: any): void {
    if (value.length) {
      this.loadCompanies(1, { name: value.trim() })
    } else {
      this.loadCompanies(this.currentPage);
    }
  }

  public searcWithDebounce(event: any): void {
    this.debounceSearchWithDiscount(event);
  }

}
