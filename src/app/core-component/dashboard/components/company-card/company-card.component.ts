import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-company-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.css']
})
export class CompanyCardComponent {
  @Input() title!: string;
  @Input() branches!: number;
  @Input() cities!: number;
  @Input() description!: string;
  @Input() iconSrc!: string;
  @Input() link!: string;
}
