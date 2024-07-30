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
import { DepartmentOverviewComponent } from '../department-overview/department-overview.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, BasicTableComponent, RouterOutlet, AddDepartmentComponent,DepartmentOverviewComponent]
})
export class DepartmentsComponent {
  showOverView: boolean = false;
  selectedCard: any = null;
  isAdd: boolean = false;
  private apiUrl = `${environment.apiBaseUrl}Company`;
department:Department={}
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

  showDetails(cardId: number) {
    this.selectedCard = this.cards.find(card => card.id === cardId);
    this.fetchData(cardId);
    this.showOverView = true;
  }

  fetchData(cardId: number) {
    const useDemoData = true;

    if (useDemoData) {
      console.log(`Fetched mock data for card ${cardId}:`, this.data);
    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.apiCall.request<any>(this.apiUrl + '/Get', 'post', {}, headers);
    }
  }


  goBack() {
    if (this.showOverView) {
      this.showOverView = false;
    } else if (this.isAdd) {
      this.isAdd = false;
    }}
  addPosition(): void {
    this.isAdd = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    console.log('Action emitted:', isAdd);
  }

}
