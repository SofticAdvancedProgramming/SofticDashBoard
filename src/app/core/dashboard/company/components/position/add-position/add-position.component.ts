import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-position',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.css']
})
export class AddPositionComponent {
  @Output() action = new EventEmitter<boolean>();

  onSave(): void {
    this.action.emit(false);
  }

  onBack(): void {
    this.action.emit(false);
  }
}
