import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownComponent } from "../components/drop-down/drop-down.component";
import { EmployeeService } from '../../../services/employeeService/employee.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MapComponent } from '../../../common-component/map/map.component';
import { TeamsService } from '../../../services/teamsService/teams.service';
import { ToastrService } from 'ngx-toastr';

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
    private cdr: ChangeDetectorRef,
    private router: Router,
    private teamsService: TeamsService,
    private toast: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      EmployeeIds: [[]],
      isAttendance: [false],
      associatedToTask: [false],  
      lat: [null],
      long: [null],
      expiryDate: [null, Validators.required]  
    });
    
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadTeams();
     this.form.get('isAttendance')?.valueChanges.subscribe((value) => {
      this.showMap = value;
      this.cdr.markForCheck(); 
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
        this.cdr.markForCheck();  
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
  navigateToDetails(teamId: number) {
     this.router.navigate([`/dashboard/TeamsDetails`, teamId]).then(success => {
       
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
  
    const companyId = Number(localStorage.getItem('companyId')) || 0; 
  
    const requestPayload = {
      id: 0,
      companyId: companyId,
      name: this.form.value.name,
      nameAr: this.form.value.nameAr,
      long: this.form.value.long || 0,
      lat: this.form.value.lat || 0,
      associatedToTask: this.form.value.associatedToTask || false,
      associatedToAttendance: this.form.value.isAttendance || false,
      expiryDate: this.form.value.expiryDate || new Date().toISOString(),
      employeeIds: this.form.value.EmployeeIds || []
    };
  
    console.log("Submitting Request:", requestPayload);
  
    this.teamsService.addTeam(requestPayload).subscribe({
      next: (response) => {
        console.log('Team added successfully', response);
        
        // ✅ Show success toaster
        this.toast.success('Team added successfully!', 'Success');
  
        // ✅ Clear the form
        this.form.reset({
          name: '',
          nameAr: '',
          EmployeeIds: [],
          isAttendance: false,
          associatedToTask: false,
          lat: null,
          long: null,
          expiryDate: null
        });
  
        // ✅ Reload the teams in the table
        this.loadTeams();
  
        // ✅ Refresh UI
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error adding team:', err);
        this.toast.error('Failed to add team', 'Error'); // ✅ Show error message
      }
    });
  }
  
  
  toggleTaskAssociation(event: any) {
    this.form.patchValue({ associatedToTask: event.target.checked });
  }
  loadTeams() {
    const companyId = Number(localStorage.getItem('companyId')) || 0;  
  
    const requestPayload = { companyId: companyId };
  
    this.teamsService.getTeam(requestPayload).subscribe({
      next: (response) => {
        this.teams = response.data.list || []; 
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading teams:', err);
      }
    });
  }
  
}  