import { Component, Input, OnInit } from '@angular/core';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';
import { branch } from '../../../../../../../models/branch';
import { MapComponent } from '../../../../components/map/map.component';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddBranchComponent } from '../add-branch/add-branch.component';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { employee } from '../../../../../../../models/employee';
import { AssignEntityComponent } from '../assign-entity/assign-entity.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-view-branches',
  standalone: true,
  templateUrl: './view-branches.component.html',
  styleUrls: ['./view-branches.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    MapComponent,
    AddBranchComponent,
    AssignEntityComponent
  ],
  providers: [BranchService, EmployeeService, MessageService]
})
export class ViewBranchesComponent implements OnInit {
  @Input() companyId?: number ;
  isAdd: boolean = false;
  showOverView: boolean = false;
  branches: branch[] = [];
  employees: employee[] = [];
  isAssignEntity: boolean = false;
  selectedBranch: branch | undefined = undefined; // Updated to use undefined

  constructor(private branchService: BranchService, private employeeService: EmployeeService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadBranches();
    this.loadEmployees();
  }

  loadBranches(): void {
    const companyId = localStorage.getItem('companyId');
    this.branchService.getBranch({ companyId }).subscribe({
      next: (response) => {
        this.branches = response.data.list;
        console.log("Branches loaded:", this.branches);
      },
      error: (err) => {
        console.error('Error loading branches', err);
        this.showError('Error loading branches');
      }
    });
  }

  loadEmployees(): void {
    const companyId = localStorage.getItem('companyId');
    this.employeeService.loadEmployees({ companyId }).subscribe({
      next: (response) => {
        this.employees = response.data.list;
        console.log("Employees loaded:", this.employees);
      },
      error: (err) => {
        console.error('Error loading employees', err);
        this.showError('Error loading employees');
      }
    });
  }

  addBranch(): void {
    this.isAdd = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    console.log('Action emitted:', isAdd);
  }

  handleBranchAdded(): void {
    this.loadBranches();  
    this.isAdd = false;   
  }

  showDetails(cardId: number) {
    this.showOverView = true;
  }

  goBack() {
    if (this.showOverView) {
      this.showOverView = false;
    } else if (this.isAdd) {
      this.isAdd = false;
    } else if (this.isAssignEntity) {
      this.isAssignEntity = false;
    }
  }

  assignEntity(branchId: number): void {
    this.selectedBranch = this.branches.find(branch => branch.id === branchId);
    this.isAssignEntity = true;
  }

  handleEntityAssigned(event: { employeeId: number, branchId: number }): void {
    const requestPayload = {
      employeeId: event.employeeId,
      branchId: event.branchId
    };
    this.employeeService.assginEmployeeToBranch(requestPayload).subscribe({
      next: (response) => {
        this.showSuccess('Employee assigned to branch successfully');
        this.isAssignEntity = false;
        this.loadBranches();
      },
      error: (err) => {
        console.error('Error assigning employee to branch', err);
        this.showError('Error assigning employee to branch');
      }
    });
  }

  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }

  private showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }
}