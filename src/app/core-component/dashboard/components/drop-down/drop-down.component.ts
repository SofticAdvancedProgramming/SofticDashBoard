import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { TranslateModule } from '@ngx-translate/core';
import { debounce } from "lodash";
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { employee } from '../../../../../models/employee';

@Component({
  selector: 'app-drop-down',
  standalone: true,
  imports: [
    MatSelectModule,
    FormsModule,
    TranslateModule,
    MatSelectInfiniteScrollModule
  ],
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css'
})
export class DropDownComponent {
  @Input() label: string = '';
  @Input() placeholder: any = '';
  @Input() placeholderSearch: any = '';
  @Input() items: any[] = [];
  @Input() itemsLength: number = 0;
  @Input() currentPage: number = 1;
  @Output() onChange = new EventEmitter<any>();
  @Output() search = new EventEmitter<any>();
  @Output() getNextPageApi = new EventEmitter<any>();

  limit: number = 10;
  private debounceSearchWithDiscount: (() => void) | any;

  searchDataValue: any = '';
  constructor() {
    this.debounceSearchWithDiscount = debounce(this.searchData.bind(this), 1000);
  }
  get isArabic(): boolean {
    return localStorage.getItem('lang') === 'ar';
  }
  onSelectChange(event: any) {
    if (+event.value) {
      this.onChange.emit(event.value);
    }
  }

  public searchData(value: any): void {
    this.search.emit(value.length > 0 ? value.trim() : '');
  }


  public searcWithDebounce(event: any): void {
    this.debounceSearchWithDiscount(event);
  }

  public getNextPage() {
    if (this.limit === this.itemsLength) {
      this.getNextPageApi.emit(this.currentPage + 1);
    }
  }
}
