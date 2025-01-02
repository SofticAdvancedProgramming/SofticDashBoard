import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-basic-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.css']
})
export class BasicTableComponent implements OnChanges {
  @Input() tableTitle: string = '';
  @Input() tableHeaders: string[] = [];
  @Input() tableData: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
  
  }

  getHeaderKey(header: string): string {
    return header.charAt(0).toLowerCase() + header.slice(1).replace(/\s+/g, '');
  }
}
