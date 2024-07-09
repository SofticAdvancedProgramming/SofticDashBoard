import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-modern-table',
  templateUrl: './modern-table.component.html',
  styleUrls: ['./modern-table.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule
  ]
})
export class ModernTableComponent {
  @Input() tableData: any[] = [];
  @Input() modalId: string = '';
  @Input() columns: string[] = [];
  @Input() searchPlaceholder: string = 'Search...';
  @Input() tableTitle: string = 'Table Title';
  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();

  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  fromDate: string = '';
  toDate: string = '';

  constructor() {}

  get filteredData() {
    let filtered = this.tableData;

    // Filter by search text
    if (this.searchText) {
      filtered = filtered.filter(item =>
        this.columns.some(column =>
          item[column].toString().toLowerCase().includes(this.searchText.toLowerCase())
        )
      );
    }

    // Filter by date range
    if (this.fromDate || this.toDate) {
      const fromDate = this.fromDate ? new Date(this.fromDate) : null;
      const toDate = this.toDate ? new Date(this.toDate) : null;

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);
      });
    }

    return this.paginatedData(filtered);
  }

  paginatedData(data: any[]): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return data.slice(start, end);
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'table_data.xlsx');
  }

  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.filteredData; // Ensure the filtered data is updated on page change
  }
}
