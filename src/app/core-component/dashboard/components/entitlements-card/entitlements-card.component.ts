import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-entitlements-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entitlements-card.component.html',
  styleUrl: './entitlements-card.component.css'
})
export class entitlementsCardComponent {
  @Input() title: string = '';
  @Input() amount: string = '';
  @Input() categories: any[] = [];
}
