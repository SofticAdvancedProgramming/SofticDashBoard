import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CommonModule , TranslateModule],
  templateUrl: './financial.component.html',
  styleUrl: './financial.component.css'
})
export class FinancialComponent {
  activeTab: string = 'Entitlements';
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
