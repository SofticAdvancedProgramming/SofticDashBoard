import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasicTableComponent } from '../../../../components/basic-table/basic-table.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Department } from '../../../../../../../models/department';
import { AddDepartmentComponent } from '../add-department/add-department.component';
import { ApiCall } from '../../../../../../services/apiCall/apicall.service';
import { environment } from '../../../../../../environment/environment';

@Component({
  selector: 'app-departments',
  standalone: true,
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, BasicTableComponent, RouterOutlet, AddDepartmentComponent]
})
export class DepartmentsComponent {
  showCards: boolean = true;
  selectedCard: any = null;
  isAdd: boolean = false;
  private apiUrl = `${environment.apiBaseUrl}Company`;

  constructor(private apiCall: ApiCall, private router: Router) { }

  cards = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    title: `UI UX Designer ${i + 1}`,
    department: 'Designing Department'
  }));

  active: boolean = true;
  headers: string[] = ['id', 'name', 'shortName', 'manager'];
  data: Department[] = [];
  title = 'Departments Overview';
  cardData: { [key: number]: Department[] } = {
    1: [
      { id: 1, name: 'Design Department', shortName: 'Design', nameAr: 'تصميم', description: 'Designing', descriptionAr: 'تصميم', manager: 'Yomna Ashraf' },
      { id: 2, name: 'HR Department', shortName: 'HR', nameAr: 'الموارد البشرية', description: 'People Department managing', descriptionAr: 'إدارة قسم الناس', manager: 'Nabil Warda' }
    ],
    2: [
      { id: 3, name: 'Development Department', shortName: 'Dev', nameAr: 'تطوير', description: 'Web developments', descriptionAr: 'تطويرات الويب', manager: 'George Mikhail' },
      { id: 4, name: 'Marketing Department', shortName: 'Marketing', nameAr: 'تسويق', description: 'Marketing', descriptionAr: 'تسويق', manager: 'Mayar' }
    ],
    3: [
      { id: 5, name: 'Business Development', shortName: 'Biz Dev', nameAr: 'تطوير الأعمال', description: 'Data Analyst', descriptionAr: 'محلل بيانات', manager: 'Aya Salah' },
      { id: 6, name: 'Traveler Department', shortName: 'Travel', nameAr: 'سفر', description: 'Ticket Maker', descriptionAr: 'صانع التذاكر', manager: 'Maged Ali' }
    ]
  };

  showDetails(cardId: number) {
    this.selectedCard = this.cards.find(card => card.id === cardId);
    this.fetchData(cardId);
    this.showCards = false;
  }

  fetchData(cardId: number) {
    // Switch between demo data and API
    const useDemoData = true; // Set to false to use API

    if (useDemoData) {
      // Use mock data
      this.data = this.cardData[cardId] || [];
      console.log(`Fetched mock data for card ${cardId}:`, this.data);
    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.apiCall.request<any>(this.apiUrl + '/Get', 'post', {}, headers);
    }
  }

  showCardsDetails() {
    this.selectedCard = null;
    this.data = [];
    this.showCards = true;
  }

  addPosition(): void {
    this.isAdd = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    console.log('Action emitted:', isAdd);
  }

  navigateToOverview(): void {
    this.router.navigate(['../DepartmentOverview']);
  }
}
