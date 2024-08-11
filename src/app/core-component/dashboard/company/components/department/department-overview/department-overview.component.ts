import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from '../../../../../../../models/company';
import { Department } from '../../../../../../../models/department';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../../../../services/comapnyService/company.service';
import { LocationService } from '../../../../../../services/lockupsServices/LocationService/location.service';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-overview',
  standalone: true,
  templateUrl: './department-overview.component.html',
  styleUrls: ['./department-overview.component.css'],
  imports: [CommonModule]
})
export class DepartmentOverviewComponent implements OnInit {
  @Input() Department: Department = {} as Department;
  @Output() departmentAdded = new EventEmitter<void>();
  companyId: string = '';
  company: Company = {} as Company;
  showAddSubDepartmentForm: boolean = false;
  isAssignEntity: boolean = false;

  showOverView: boolean = false;
  isAdd: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private locationService: LocationService,
    private departmentService: DepartmentService
  ) {}

  async ngOnInit() {
    this.companyId = this.route.snapshot.paramMap.get('companyId') || '';
    const departmentId = this.route.snapshot.paramMap.get('departmentId') || '';
    if (this.companyId) {
      await this.getCompanyDetails(this.companyId);
    }
    if (departmentId && !this.Department.id) {
      await this.getDepartmentDetails(departmentId);
    }
  }

  async getCompanyDetails(companyId: string): Promise<void> {
    try {
      const response = await this.companyService.getCompany({ id: companyId }).toPromise();
      if (response && response.data && response.data.list && response.data.list.length > 0) {
        this.company = response.data.list[0];
        console.log("this.company:", this.company);
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  }

  getDepartmentDetails(departmentId: string): void {
    this.departmentService.getDepartment({ id: departmentId }).subscribe({
      next: (response) => {
        if (response && response.data && response.data.list && response.data.list.length > 0) {
          this.Department = response.data.list[0]; 
          console.log('Department Details:', this.Department);
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      error: (err) => {
        console.error('Error fetching department details', err);
      }
    });
  }

  toggleAddSubDepartment() {
    this.showAddSubDepartmentForm = !this.showAddSubDepartmentForm;
  }

  handleAddSubDepartmentAction(event: boolean) {
    this.showAddSubDepartmentForm = !event;
  }


  goBack() {
    this.departmentAdded.emit();  
  }
}
