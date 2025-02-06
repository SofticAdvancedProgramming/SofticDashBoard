import { EmployeeService } from './../../../../services/employeeService/employee.service';
import { TranslationService } from './../../../../core/services/translationService/translation.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
 import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { TeamsService } from '../../../../services/teamsService/teams.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from "../../../../common-component/map/map.component";

@Component({
    selector: 'app-teams-details',
    standalone: true,
    templateUrl: './teams-details.component.html',
    styleUrl: './teams-details.component.css',
    imports: [TranslateModule, FormsModule, CommonModule, MapComponent]
})
export class TeamsDetailsComponent implements OnInit {
  teamId!: number;
  teamDetails: any = null;
  teams: any[] = [];
  editMode = false;
  editForm: FormGroup;
  employees: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamsService: TeamsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private TranslationService: TranslationService,
    private EmployeeService: EmployeeService
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      long: [0, Validators.required],
      lat: [0, Validators.required],
      associatedToTask: [false],
      associatedToAttendance: [false],
      expiryDate: [null],
      employeeIds: [[]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.teamId = Number(params.get('id'));
      if (this.teamId) {
        this.loadTeamDetails();
      }
    });

    this.loadTeamDetails();
  }
  loadTeamDetails() {
    const companyId = Number(localStorage.getItem('companyId')) || 0;
    this.teamsService.getTeam({ companyId }).subscribe({
      next: (response) => {
        this.teamDetails = response.data.list.find((team: any) => team.id === this.teamId) || null;
        if (this.teamDetails) {
          this.loadEmployees();  // Fetch employees for this team
          this.editForm.patchValue(this.teamDetails);
        }
      },
      error: (err) => {
        console.error('Error loading team details:', err);
      },
    });
  }
  
  loadEmployees() {
    if (!this.teamDetails) return;
  
    this.EmployeeService.loadEmployees({ teamId: this.teamId }).subscribe({
      next: (response) => {
        this.employees = response.data.list || []; 
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      },
    });
  }
  

  toggleEdit() {
    this.editMode = !this.editMode;
    if (this.editMode && this.teamDetails) {
      this.editForm.patchValue(this.teamDetails);
    }
  }

  updateTeam() {
    if (this.editForm.invalid) {
      return;
    }

    const updatedTeam = {
      ...this.teamDetails,
      ...this.editForm.value,
    };

    this.teamsService.editTeam(updatedTeam).subscribe({
      next: () => {
        this.toastr.success('Team updated successfully!');
        this.editMode = false;
        this.loadTeamDetails();
      },
      error: (err) => {
        console.error('Error updating team:', err);
        this.toastr.error('Failed to update team.');
      },
    });
  }
}
