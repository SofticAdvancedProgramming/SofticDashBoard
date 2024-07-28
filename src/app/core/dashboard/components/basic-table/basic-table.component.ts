import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-basic-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basic-table.component.html',
  styleUrl: './basic-table.component.css'
})
export class BasicTableComponent {
  @Input() tableTitle: string = '';
  @Input() tableHeaders: string[] = [];
  @Input() tableData: any[] = [];
}
