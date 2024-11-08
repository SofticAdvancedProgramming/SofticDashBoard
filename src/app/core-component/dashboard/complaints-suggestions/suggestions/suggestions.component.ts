import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

enum SuggestionStatus {
  PENDING = 2,
  REJECTED = 3,
  ACCEPTED = 1,
  REVIEW = 4,
}

interface Suggestion {
  id: number;
  employee: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    profileImage?: string;
  };
  title: string;
  description: string;
  statusId: SuggestionStatus;
  companyId: number;
}

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css'],
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink],
  standalone: true
})
export class SuggestionsComponent implements OnInit {
  suggestions: Suggestion[] = [];
  filteredSuggestions: Suggestion[] = [];
  selectedStatus: SuggestionStatus = SuggestionStatus.PENDING;
  public SuggestionStatus = SuggestionStatus;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalSuggestions: number = 0;

  constructor(private translate: TranslateService,private router: Router) {}

  ngOnInit(): void {
    this.loadDemoSuggestions();
    this.filterSuggestions();
  }

  loadDemoSuggestions(): void {
    this.suggestions = [
      {
        id: 1,
        employee: { firstName: 'Yomna', lastName: 'Ashraf', jobTitle: 'UI/UX Designer' },
        title: 'New feature suggestion',
        description: 'Implement a new design enhancement',
        statusId: SuggestionStatus.PENDING,
        companyId: 1,
      },
      {
        id: 2,
        employee: { firstName: 'Yomna', lastName: 'Ashraf', jobTitle: 'UI/UX Designer' },
        title: 'UI improvement',
        description: 'Enhance the user interface in the main dashboard',
        statusId: SuggestionStatus.REJECTED,
        companyId: 1,
      },
      {
        id: 3,
        employee: { firstName: 'Yomna', lastName: 'Ashraf', jobTitle: 'UI/UX Designer' },
        title: 'Optimize performance',
        description: 'Optimize loading speed for user experience',
        statusId: SuggestionStatus.ACCEPTED,
        companyId: 1,
      },
      {
        id: 4,
        employee: { firstName: 'Yomna', lastName: 'Ashraf', jobTitle: 'UI/UX Designer' },
        title: 'Feature on review',
        description: 'Review new feature suggestions',
        statusId: SuggestionStatus.REVIEW,
        companyId: 1,
      }
    ];
    this.totalSuggestions = this.suggestions.length;
  }

  filterSuggestions(): void {
    this.filteredSuggestions = this.suggestions.filter(suggestion => {
      return this.selectedStatus === SuggestionStatus.PENDING || suggestion.statusId === this.selectedStatus;
    });
  }

  deleteSuggestion(id: number): void {
    this.suggestions = this.suggestions.filter(suggestion => suggestion.id !== id);
    this.filterSuggestions();
    console.log(`Suggestion ${id} deleted successfully.`);
  }

  getSuggestionStatusName(statusId: SuggestionStatus): string {
    switch (statusId) {
      case SuggestionStatus.PENDING:
        return 'Pending';
      case SuggestionStatus.REJECTED:
        return 'Rejected';
      case SuggestionStatus.ACCEPTED:
        return 'Accepted';
      case SuggestionStatus.REVIEW:
        return 'On review';
      default:
        return 'Unknown Status';
    }
  }
  viewSuggestionDetails(id: number): void {
    this.router.navigate(['/SuggestionDetails', id]);
  }
}
