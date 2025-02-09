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
import { ConfirmnDeleteDialogComponent } from "../../../common-component/confirmn-delete-dialog/confirmn-delete-dialog.component";
import { AddTeamRequest, Team } from '../../../../models/teams';

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
        MapComponent,
        ConfirmnDeleteDialogComponent
    ]
})
export class TeamsComponent implements OnInit {
  form: FormGroup;
  teams: Team[] = [];
  employees: any[] = [];
  isSubmitting = false;
  loadingMoreEmployees = false;
  isEdit: boolean = false;
  showMap: boolean = false;
  location: { lat: number, lng: number } | null = null;
  showDeleteDialog: boolean = false;
  teamIdToDelete: number | null = null;
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
    if (this.form.invalid) return;

    const companyId = Number(localStorage.getItem('companyId')) || 0;
    const requestPayload: AddTeamRequest = {
      id: 0,
      companyId,
      name: this.form.value.name,
      nameAr: this.form.value.nameAr,
      long: this.form.value.long || 0,
      lat: this.form.value.lat || 0,
      associatedToTask: this.form.value.associatedToTask || false,
      associatedToAttendance: this.form.value.isAttendance || false,
      expiryDate: this.form.value.expiryDate || new Date().toISOString(),
      employeeIds: this.form.value.EmployeeIds || []
    };

    this.teamsService.addTeam(requestPayload).subscribe({
      next: () => {
        this.toast.success('Team added successfully!', 'Success');
        this.form.reset();
        this.loadTeams();
      },
      error: (err) => {
        console.error('Error adding team:', err);
        this.toast.error('Failed to add team', 'Error');
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
  openDeleteDialog(teamId: number) {
    this.teamIdToDelete = teamId;
    this.showDeleteDialog = true;
  }

  confirmDelete() {
    if (!this.teamIdToDelete) return;

    const companyId = Number(localStorage.getItem('companyId')) || 0;
    
    this.teamsService.delete(this.teamIdToDelete, companyId).subscribe({
      next: () => {
        this.toast.success('Team deleted successfully!', 'Success');
        this.loadTeams();   
        this.showDeleteDialog = false;  
        this.teamIdToDelete = null;
      },
      error: (err) => {
        console.error('Error deleting team:', err);
        this.toast.error('Failed to delete team', 'Error');
        this.showDeleteDialog = false;
      }
    });
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.teamIdToDelete = null;
  }
}  