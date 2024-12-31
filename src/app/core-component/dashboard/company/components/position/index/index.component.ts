import { Component, OnInit, Input, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PositionService } from '../../../../../../services/positionService/position.service';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { AssignEmployeesComponent } from '../../../../employee/assign-employees/assign-employees.component';
import { AddPositionComponent } from '../add-position/add-position.component';
import { employee } from '../../../../../../../models/employee';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Department } from '../../../../../../../models/department';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { ModernTableComponent } from '../../../../components/modern-table/modern-table.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Position } from '../../../../../../../models/postion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { EventEmitter } from 'stream';import { PositionTypeService } from '../../../../../../services/lockupsServices/positionTypeService/position-type.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { branch } from '../../../../../../../models/branch';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';
@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [PositionService, EmployeeService, MessageService, ConfirmationService],
  imports: [RouterLink, CommonModule, AssignEmployeesComponent, PaginationModule, AddPositionComponent, ToastModule, ModernTableComponent, FormsModule, TranslateModule, ConfirmDialogModule]
})
export class IndexComponent implements OnInit {
  isAdd: boolean = false;
  isEdit: boolean = false;
  isAddEmployee: boolean = false;
  showDetails: boolean = false;
  selectedPositionId?: string;
  selectedPositionData: any = {};
  directManger?: employee = {} as employee;
  employees: employee[] = [];

  @Input() companyId?: any = '';
  positions: Position[] = [];
  departments: Department[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  isArabic: boolean = false;
  searchText!:string;
  selectedDepartmentId: number | null = null;
  filteredDepartments: Department[] = [];
  totalEmployees: number = 0;
  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    PositionType: {
      load: 'getPositionTypes',
      add: 'addPositionType',
      edit: 'editPositionType',
      delete: 'deletePositionType',
      data: 'PositionTypes'
    }
  };


  positionData!: Position;
  branchId:number=0;
  constructor(
    private positionService: PositionService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private branchService: BranchService,

    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private positionTypeService: PositionTypeService,
     private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isArabic = this.translate.currentLang === 'ar';
    this.loadDepartments();
    this.loadPositions();
    this.loadAllDepartments(); // Load all departments for the filter

    this.translate.onLangChange.subscribe((event) => {
      this.isArabic = event.lang === 'ar';
    });
  }
  loadAllDepartments(): void {
    if (this.companyId) {
      this.departmentService.getDepartment({ companyId: this.companyId }).subscribe({
        next: (response) => {
          this.departments = response.data.list;
         },

      });
    }
  }
  private getCompanyId(): number | null {
    return this.companyId ? Number(this.companyId) : null;
  }

  loadPositions(page: number = this.currentPage): void {
    const companyId = this.getCompanyId();
    if (!companyId) return;

     const payload: any = {
      companyId: companyId,
      pageIndex: page,
      pageSize: this.itemsPerPage,
    };

    if (this.selectedDepartmentId !== null) {
      payload.departmentId = this.selectedDepartmentId;
    }

    console.log('Sending payload:', payload); // Debugging line

    this.positionService.getPosition(payload).subscribe({
      next: (response) => {
        console.log( response.data.list)
        this.positions = response.data.list;
        this.totalItems = response.data.totalRows;
        this.getPositionEmployee();
      },

    });

  }
  filterPositionsByDepartment(): void {
    this.currentPage = 1;
    this.loadPositions();
  }

  async getPositionEmployee(): Promise<void> {
    for (let item of this.positions) {
      const response: any = await firstValueFrom(this.employeeService.getEmployees({ positionId: item.id }));
      if (response.data.list.length > 0) {
        item.isAssigned = true;
        item.employeeName=response.data.list[0].firstName +" " + response.data.list[0].lastName
      } else {
        item.isAssigned = false; // Explicitly set it to false if no employee is assigned
      }
    }
  }

  loadUnassignedEmployees(page: number = 1): void {
    this.employeeService.loadEmployees({
      companyId: this.companyId,
      accountStatus: 1,
      pageIndex: page,
      pageSize: this.itemsPerPage,
    }).subscribe({
      next: (response) => {
        this.employees = response.data.list.filter(
          (employee: any) => !employee.positionId
        );
        this.totalEmployees = response.data.totalRows;
       },
     });
  }

  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadPositions(this.currentPage);
  }

  loadEmployeesByPosition(positionId: string): void {
    this.employeeService.loadEmployees({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.employees = response.data.list.filter(
          (employee: any) => employee.positionId === positionId
        );
       }
    });
  }

  loadDepartments(): void {
    if (this.companyId) {
      this.departmentService.getDepartment({ companyId: this.companyId }).subscribe({
        next: (response) => {
          this.departments = response.data.list;
        },
        error: (err) => {
         }
      });
    }
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find(dep => dep.id === departmentId);
    return department?.name ?? 'Unknown';
  }

  addPosition(): void {
    this.isAdd = true;
  }

  editPosition(position: Position): void {
    this.isEdit = true;
    this.positionData = position;
    const department = this.departments.find(dep => dep.id === position.departmentId);
    if(department?.branchId){
      this.branchId=department.branchId
     }

  }


  addEmployee(positionId: string): void {
    this.selectedPositionId = positionId;
    this.selectedPositionData = this.positions.find(position => position.id === Number(positionId));
    this.loadUnassignedEmployees();
    this.isAddEmployee = true;
    console.log(positionId);

  }


  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    this.isEdit = isAdd;
    this.loadPositions();
    this.ngOnInit();
    this.cdr.detectChanges();
  }

  closePopup(): void {
    this.isAddEmployee = false;
  }

  handleFormSubmit(formData: { employeeId: number, positionId: number }): void {
    this.employeeService.assginEmployeeToPosition({
      employeeId: formData.employeeId,
      positionId: formData.positionId
    }).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee assigned successfully' });
        this.closePopup();
        this.loadPositions();
        this.loadUnassignedEmployees();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error assigning employee' });
      }
    });
  }


  deletePosition(positionId: number): void {
    this.confirmationService.confirm({
      message: this.translate.instant('INDEX_POSITION.CONFIRM_DELETE_MESSAGE'),
      header: this.translate.instant('INDEX_POSITION.DELETE_CONFIRMATION_TITLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant('INDEX_POSITION.YES'),
      rejectLabel: this.translate.instant('INDEX_POSITION.NO'),
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        const companyId = this.companyId ? this.companyId : 0;
        this.positionService.deletePosition(positionId, companyId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('INDEX_POSITION.DELETE_SUCCESS')
            });
            this.loadPositions();
            this.ngOnInit();
            this.cdr.detectChanges();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: this.translate.instant('position.ACTION_CANCELLED')
            });
          }
        });
      },
      reject: () => {
      }
    });
  }

  showDetailsPage(positionId: string): void {
    this.selectedPositionId = positionId;
    this.selectedPositionData = this.positions.find(position => position.id === Number(positionId));
    this.loadEmployeesByPosition(positionId);
    this.showDetails = true;
  }

  goBack(): void {
    this.showDetails = false;
  }
  toggleActivation(Position: Position): void {
    debugger
    Position.isActive ? this.deactivatePosition(Position) : this.activatePosition(Position);
  }

  activatePosition(Position: Position): void {
    debugger
    this.positionService.activatePosition(Position.id || 0, Position.companyId || 0).subscribe({
      next: () => {
        Position.isActive = true;
        this.showSuccess('Position activated successfully');
      }
    });
  }

  deactivatePosition(Position: Position): void {
    debugger
    this.positionService.deactivatePosition(Position.id || 0, Position.companyId || 0).subscribe({
      next: () => {
        Position.isActive = false;
        this.showSuccess('Position deactivated successfully');
      }
    });
  }
  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }
  loadEntities(entity: string, pageIndex: number): void {
    let name=this.searchText.trim();
    let query: any = { companyId: this.companyId, pageIndex };
     if(name){
    if (/^[a-zA-Z]/.test(name)) {
      query = {
        ...query,
        name:name
      };
    }else if(name){
      query = {
        ...query,
        nameAr:name
      };
    }}
     const methodName = this.entityTypes[entity].load as keyof PositionTypeService;
    (this.positionTypeService[methodName] as Function)(query).subscribe(
      (response: any) => {
         if (response.status === 200) {
          (this as any)[this.entityTypes[entity].data] = response.data.list;
         this.positions=response.data.list
        }
      }
    );
  }
  loadMoreEmployees(page: number): void {
    this.employeeService.loadEmployees({
      companyId: this.companyId,
      accountStatus: 1,
      pageIndex: page,
      pageSize: this.itemsPerPage,
    }).subscribe({
      next: (response) => {
         this.employees.push(
          ...response.data.list.filter((employee: any) => !employee.positionId)
        );
        this.totalEmployees = response.data.totalRows;
      },
     });
  }

  searchUnassignedEmployees(searchTerm: string): void {
    this.employeeService.loadEmployees({
      companyId: this.companyId,
      accountStatus: 1,
      search: searchTerm
    }).subscribe({
      next: (response) => {
        this.employees = response.data.list.filter(
          (employee: any) => !employee.positionId
        );
        this.totalEmployees = response.data.totalRows;
      },
     });
  }
  closeDropdown(event: Event) {
    const dropdownMenu = (event.target as HTMLElement).closest('.dropdown-menu');
    dropdownMenu?.classList.remove('show');
}
}
