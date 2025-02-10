import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { employee } from '../../../models/employee';
import { EmployeeService } from '../../services/employeeService/employee.service';
import { AssetsService } from '../../services/AssetsService/assets.service';
import { DropDownComponent } from "../../core-component/dashboard/components/drop-down/drop-down.component";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-assign-asset-popup',
  standalone: true,
  templateUrl: './assign-asset-popup.component.html',
  styleUrls: ['./assign-asset-popup.component.css'],
  imports: [DropDownComponent, CommonModule, FormsModule,TranslateModule]
})
export class AssignAssetPopupComponent {
  @Input() assetId: number = 0;
  @Output() closeAssignAssets = new EventEmitter<boolean>();
  @Output() onEmployeeSelected = new EventEmitter<employee>();
  @Input() employees: employee[] = [];
  selectedEmployee: employee | null = null;
  loadingMoreEmployees = false;
  employeePage = 1;
  assignDate: string = '';
  @Output() onChange = new EventEmitter<employee>();

  constructor(private employeeService: EmployeeService,
    private assetService: AssetsService,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) { }
  ngOnInit() {
    this.assetId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmployees();
  }
  closePopup() {
    this.closeAssignAssets.emit(false);
  }
  Submit() {
    if (this.selectedEmployee && this.assignDate && this.assetId) {
      const assignAssetData = {
        assetId: this.assetId,
        employeeId: this.selectedEmployee.id,
        assignDate: this.assignDate
      };

      this.assetService.assignAsset(assignAssetData).subscribe({
        next: (response) => {
          this.toast.success('Asset assigned successfully');
          this.onEmployeeSelected.emit(this.selectedEmployee!);
          this.closePopup();
        },

      });
    }
  }


  loadEmployees() {
    if (this.loadingMoreEmployees) return;
    this.loadingMoreEmployees = true;

    this.employeeService.loadEmployees({
      accountStatus: 1,
      pageIndex: this.employeePage,
      pageSize: 10
    }).subscribe({
      next: (response) => {
        const newItems = response.data.list.filter((item: any) => !this.employees.some(a => a.id == item.id))
          .map((employee: any) => ({
            ...employee,
            name: `${employee.firstName} ${employee.lastName}`
          }));

        this.employees = [...this.employees, ...newItems];
        this.employeePage++;
        this.loadingMoreEmployees = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.loadingMoreEmployees = false;
      }
    });
  }

  onEmployeeSelect(employeeId: number) {
    const employee = this.employees.find(emp => emp.id === employeeId);

    if (employee) {

      this.selectedEmployee = employee;
    }
  }


}
