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
  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() newReqByPage = new EventEmitter<any>();
  @Output() searchDateApi = new EventEmitter<any>();
  @Output() searchApi = new EventEmitter<any>();
  @Output() onCLickNewActionOutput = new EventEmitter<any>();
  @ViewChild('deletePopUp') deletePopUp!: DeletePopUpComponent;
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
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
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

  public onCLickNewAction(data: any) {
    this.onCLickNewActionOutput.emit(data);
  }


}
