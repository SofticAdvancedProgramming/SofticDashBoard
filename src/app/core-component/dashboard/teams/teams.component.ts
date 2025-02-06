import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownComponent } from "../components/drop-down/drop-down.component";
import { EmployeeService } from '../../../services/employeeService/employee.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MapComponent } from '../../../common-component/map/map.component';

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
        MatOptionModule,
        MapComponent
    ]
})
export class TeamsComponent implements OnInit {
  form: FormGroup;
  teams = [
    { id: 1, name: 'Development Team', nameAr: 'فريق التطوير' },
    { id: 2, name: 'Marketing Team', nameAr: 'فريق التسويق' },
  ];
  employees: any[] = [];
  isSubmitting = false;
  loadingMoreEmployees = false;
  isEdit: boolean = false;
  showMap: boolean = false;
  location: { lat: number, lng: number } | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      EmployeeIds: [[]],
      isAttendance: [false],
      lat: [null],
      long: [null]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();

    // Listen for isAttendance checkbox changes to update map visibility
    this.form.get('isAttendance')?.valueChanges.subscribe((value) => {
      this.showMap = value;
      this.cdr.markForCheck(); // Ensure UI updates
    });
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
        this.cdr.markForCheck(); // Force UI update
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.loadingMoreEmployees = false;
      }
    });
  }
  
  onLocationSelected(location: { lat: number, lng: number }): void {
    this.form.patchValue({ lat: location.lat, long: location.lng });
    this.location = location;
  }
}
