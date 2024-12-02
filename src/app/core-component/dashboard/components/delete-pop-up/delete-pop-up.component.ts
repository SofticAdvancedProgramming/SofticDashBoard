import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-pop-up',
  templateUrl: './delete-pop-up.component.html',
  styleUrls: ['./delete-pop-up.component.css'],
  standalone: true,
  imports: [TranslateModule]
})
export class DeletePopUpComponent {
  @Output() confirmDelete = new EventEmitter<void>();
  @Input() deleteId: string = '';
  confirmDeletion() {
    this.confirmDelete.emit();
  }
}
