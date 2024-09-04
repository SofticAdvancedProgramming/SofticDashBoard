import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-lockup-card',
  standalone: true,
  imports: [RouterLink , TranslateModule , CommonModule],
  templateUrl: './lockup-card.component.html',
  styleUrl: './lockup-card.component.css'
})
export class LockupCardComponent {
  constructor(public translate: TranslateService) {}
  @Input() iconSrc!: string;
  @Input() header!: string;
  @Input() description!: string;
  @Input() link!: string;
  get isArabic(): boolean {
    return localStorage.getItem('lang') === 'ar';
  }
}
