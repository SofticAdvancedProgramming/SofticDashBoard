import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownComponent } from "../components/drop-down/drop-down.component";
import { EmployeeService } from '../../../services/employeeService/employee.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
    selector: 'app-teams',
    standalone: true,
    templateUrl: './teams.component.html',
    styleUrls: ['./teams.component.css'],
    imports: [
        TranslateModule,
        RouterLink,
        RouterLinkActive,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        DropDownComponent,
        MatSelectModule,
        MatOptionModule
    ]
})
export class TeamsComponent implements OnInit {
  form: FormGroup;
  teams = [
    { id: 1, name: 'Development Team', nameAr: 'فريق التطوير' },
    { id: 2, name: 'Marketing Team', nameAr: 'فريق التسويق' },
  ];
  TeamCategories = [
    { id: 1, name: 'Technical' },
    { id: 2, name: 'Business' },
    { id: 3, name: 'Support' },
  ];
  employees: any[] = [];
  selectedTeamCategory: any;
  isSubmitting = false;
  loadingMoreEmployees = false;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      category: [null, Validators.required],
      EmployeeIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }
  
  loadEmployees() {
    if (this.loadingMoreEmployees) return;
    this.loadingMoreEmployees = true;
    
    this.employeeService.loadEmployees({ pageSize: 1000 }).subscribe({
      next: (response) => {
        this.employees = response.data.list.map((employee: any) => ({
          ...employee,
          name: `${employee.firstName} ${employee.lastName}`
        }));
        this.loadingMoreEmployees = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.loadingMoreEmployees = false;
      }
    });
  }
}
