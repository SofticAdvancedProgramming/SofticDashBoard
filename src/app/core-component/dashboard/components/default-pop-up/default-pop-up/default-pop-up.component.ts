import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-default-pop-up',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './default-pop-up.component.html',
  styleUrl: './default-pop-up.component.css'
})
export class DefaultPopUpComponent {
  @Output() confirm_Default = new EventEmitter<void>();
  @Input() defaultId: string = '';
  confirmDefault() {
    this.confirm_Default.emit();
  }
}
