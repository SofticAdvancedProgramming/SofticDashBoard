import { Component, EventEmitter, Output } from '@angular/core';
import { TranslationService } from '../../../../../core/services/translationService/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-confirmation-pop-up',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './delete-confirmation-pop-up.component.html',
  styleUrl: './delete-confirmation-pop-up.component.css',
})
export class DeleteConfirmationPopUpComponent {
  constructor(private translateService: TranslationService) {}
  @Output() confirm = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<boolean>();

  onConfirm(): void {
    this.confirm.emit(true);
  }

  onCancel(): void {
    this.cancel.emit(false);
  }
}
