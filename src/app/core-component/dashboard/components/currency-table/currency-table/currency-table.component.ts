import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DeletePopUpComponent } from '../../delete-pop-up/delete-pop-up.component';
import { ToastersService } from '../../../../../core/services/toast-service/toast.service';
import { TranslationService } from '../../../../../core/services/translationService/translation.service';
import { debounce } from 'lodash';
import * as XLSX from 'xlsx';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { DefaultPopUpComponent } from '../../default-pop-up/default-pop-up/default-pop-up.component';

interface newAction {
  isExisting: false;
  src: string;
}

@Component({
  selector: 'app-currency-table',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule,
    DeletePopUpComponent,
    TranslateModule,
    DefaultPopUpComponent
  ],
  templateUrl: './currency-table.component.html',
  styleUrl: './currency-table.component.css',
})
export class CurrencyTableComponent {
  @Input() showActions: boolean = true;
  @Input() isThereSearch: boolean = true;
  @Input() isThereSearchByDate: boolean = true;
  @Input() isThereDelete: boolean = true;
  @Input() isThereEdit: boolean = true;
  @Input() isThereDefault: boolean = true;
  @Input() newAction: newAction[] = [];
  @Input() tableData: any[] = [];
  @Input() modalId: string = '';
  @Input() deleteId: string = '';
  @Input() defaultId: string = '';
  @Input() columns: string[] = [];
  @Input() searchPlaceholder: string = 'Search...';
  @Input() tableTitle: string = 'Table Title';
  @Input() totalRows: number = 0;
  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() defaultItem = new EventEmitter<any>();
  @Output() newReqByPage = new EventEmitter<any>();
  @Output() searchDateApi = new EventEmitter<any>();
  @Output() searchApi = new EventEmitter<any>();
  @Output() onCLickNewActionOutput = new EventEmitter<any>();
  @ViewChild('deletePopUp') deletePopUp!: DeletePopUpComponent;
  @ViewChild('defaultPopUp') defaultPopUp!: DefaultPopUpComponent;
  deleteMethod!: (index: number) => void;
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  fromDate: string = '';
  toDate: string = '';
  selectedItemToDelete: any = null;
  selectedItemToDefault: any = null;

  src = 'delete.png';

  private debounceSearchWithDiscount: (() => void) | any;

  constructor(
    private toast: ToastersService,
    private translationService: TranslationService
  ) {
    this.debounceSearchWithDiscount = debounce(this.search.bind(this), 500);
  }

  ngOnInit(): void {}

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableData);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    XLSX.writeFile(workbook, 'table_data.xlsx');
  }

  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.newReqByPage.emit(this.currentPage);
  }

  openDeleteModal(item: any): void {
    this.selectedItemToDelete = item;
    console.log('Delete modal opened for:', item);
  }
  openDefaultModal(item: any): void {
    console.log('Default modal opened for:', item);
    this.selectedItemToDefault = item;
  }

  confirmDelete(): void {
    if (this.selectedItemToDelete) {
      this.deleteItem.emit(this.selectedItemToDelete);
      console.log(this.selectedItemToDelete);
      this.selectedItemToDelete = null;
    }
  }
  confirmDefualt(): void {
    if (this.selectedItemToDefault) {
      this.defaultItem.emit(this.selectedItemToDefault);
      console.log(this.selectedItemToDefault);
      this.selectedItemToDefault = null;
    }
  }

  searchDate(): void {
    if (this.fromDate > this.toDate) {
      this.toast.typeInfo(
        this.translationService.translate('You must choose an end date.')
      );
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
