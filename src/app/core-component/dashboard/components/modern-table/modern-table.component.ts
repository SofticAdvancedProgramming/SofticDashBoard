import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import * as XLSX from 'xlsx';
import { DeletePopUpComponent } from '../delete-pop-up/delete-pop-up.component';
import { ToastersService } from '../../../../core/services/toast-service/toast.service';
import { TranslationService } from '../../../../core/services/translationService/translation.service';
import { debounce } from "lodash";
import { TranslateModule } from '@ngx-translate/core';

interface newAction {
  isExisting: false,
  src: string
}

@Component({
  selector: 'app-modern-table',
  templateUrl: './modern-table.component.html',
  styleUrls: ['./modern-table.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule,
    DeletePopUpComponent,
    TranslateModule
  ]
})

export class ModernTableComponent implements OnInit {
  @Input() showActions: boolean = true;
  @Input() isThereSearch: boolean = true;
  @Input() isThereSearchByDate: boolean = true;
  @Input() isThereDelete: boolean = true;
  @Input() isThereEdit: boolean = true;
  @Input() newAction: newAction[] = []
  @Input() tableData: any[] = [];
  @Input() modalId: string = '';
  @Input() deleteId: string = '';
  @Input() columns: string[] = [];
  @Input() searchPlaceholder: string = 'Search...';
  @Input() tableTitle: string = 'Table Title';
  @Input() totalRows: number = 0;
  @Input() filterDropDown: boolean = false;
  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() newReqByPage = new EventEmitter<any>();
  @Output() searchDateApi = new EventEmitter<any>();
  @Output() searchApi = new EventEmitter<any>();
  @Output() onCLickNewActionOutput = new EventEmitter<any>();
  @ViewChild('deletePopUp') deletePopUp!: DeletePopUpComponent;
  @Output() FilteredApi = new EventEmitter<any>();
  deleteMethod!: (index: number) => void;
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  fromDate: string = '';
  toDate: string = '';
  selectedItemToDelete: any = null;

  src = 'delete.png'

  private debounceSearchWithDiscount: (() => void) | any;

  constructor(
    private toast: ToastersService,
    private translationService: TranslationService,
  ) {
    this.debounceSearchWithDiscount = debounce(this.search.bind(this), 500);
  }

  ngOnInit(): void {
  }
  exportToExcel(): void {
    const keysToExclude = ['id'];
  
    // Transform the data by excluding specific keys and formatting headers
    const formattedData = this.tableData.map(item => {
      const transformedItem: any = {};
      for (const key in item) {
        if (!keysToExclude.includes(key)) {
          const formattedKey = key
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space between camel case
            .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
          transformedItem[formattedKey] = item[key];
        }
      }
      return transformedItem;
    });
  
    // Create a worksheet with the transformed data
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
  
    // Get headers
    const headers = Object.keys(formattedData[0] || {});
  
    // Calculate column widths based on the largest content
    const columnWidths = headers.map(header => {
      // Include header width
      let maxWidth = header.length;
  
      // Check the length of data in each row for this column
      for (const row of formattedData) {
        const cellValue = row[header];
        const cellLength = cellValue ? cellValue.toString().length : 0;
        if (cellLength > maxWidth) {
          maxWidth = cellLength;
        }
      }
  
      return { width: maxWidth + 2 }; // Add padding
    });
  
    // Apply column widths
    worksheet['!cols'] = columnWidths;
  
    // Style the headers
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // First row (header)
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          font: { bold: true }, // Bold text
          fill: { fgColor: { rgb: 'FFFF00' } }, // Yellow background
          alignment: { horizontal: 'center', vertical: 'center' }, // Center alignment
        };
      }
    }
  
    // Create a workbook and add the worksheet
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  
    // Write the workbook to a file
    XLSX.writeFile(workbook, 'table_data.xlsx');
  }
  

  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.newReqByPage.emit(this.currentPage);
  }

  openDeleteModal(item: any): void {
    this.selectedItemToDelete = item;
  }

  confirmDelete(): void {
    if (this.selectedItemToDelete) {
      this.deleteItem.emit(this.selectedItemToDelete);
      this.selectedItemToDelete = null;
    }
  }

  searchDate(): void {
    if (this.fromDate > this.toDate) {
      this.toast.typeInfo(this.translationService.translate('You must choose an end date.'));
      return;
    }
    this.searchDateApi.emit({ fromDate: this.fromDate, toDate: this.toDate });
  }

  public searcWithDebounce(event: any): void {
    this.debounceSearchWithDiscount(event);
  }

  public search(value: any): void {
    this.searchApi.emit(value.length > 0 ? value.trim() : '');
  }
  selectedValue: string = '';
  public filter(): void {
    this.FilteredApi.emit(this.selectedValue);
  }

  public onCLickNewAction(data: any) {
    this.onCLickNewActionOutput.emit(data);
  }
  onOptionSelected(event:any){
  

  }


}
