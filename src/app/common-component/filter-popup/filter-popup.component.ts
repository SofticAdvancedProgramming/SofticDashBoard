import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.css']
})
export class FilterPopupComponent {

  @Output() closeFilterPopup = new EventEmitter<boolean>();

  closePopup() {
    this.closeFilterPopup.emit(false);
  }

  applyFilters() {
    console.log('Filters applied');
    this.closePopup();
  }
}
