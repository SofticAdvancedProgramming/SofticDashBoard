import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ComplaintsComponent } from "./complaints/complaints.component";
import { SuggestionsComponent } from "./suggestions/suggestions.component";

@Component({
    selector: 'app-complaints-suggestions',
    standalone: true,
    templateUrl: './complaints-suggestions.component.html',
    styleUrl: './complaints-suggestions.component.css',
    imports: [TranslateModule, CommonModule, ComplaintsComponent, SuggestionsComponent]
})
export class ComplaintsSuggestionsComponent {
  constructor(
    private translate: TranslateService

  ) { }
  activeTab: string = 'complaints';

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
