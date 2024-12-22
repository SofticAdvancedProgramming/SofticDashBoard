import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { ModernTableComponent } from "../../components/modern-table/modern-table.component";
import { SalaryTypeService } from '../../../../services/lockupsServices/SalaryService/salary.service';
import { ToastersService } from '../../../../core/services/toast-service/toast.service';
import { CommonModule, DatePipe } from '@angular/common';
import { BenefitTypeService } from '../../../../services/benefitTypeService/benefit-type.service';
import { BenefitService } from '../../../../services/benefitService/benefit.service';
import { DynamicModalComponent } from "../../components/dynamic-modal/dynamic-modal.component";
import { DeletePopUpComponent } from "../../components/delete-pop-up/delete-pop-up.component";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmnDeleteDialogComponent } from '../../../../common-component/confirmn-delete-dialog/confirmn-delete-dialog.component';
interface Salary {
  grossSalary: string;
  netSalary: string;
}

interface EmployeeResponse {
  data: {
    list: Array<{
      grossSalary: string;
      netSalary: string;
    }>;
  };
  message: string;
}
interface Benefit {
  amount: number;
  benefitTypeName: string
  transactionDate: string;
  benefitType?: {
    name: string;
    nameAr: string;
  };
}
interface BenefitType {
  id: number;
  companyId: number;
  name: string;
  nameAr: string;
}
@Component({
  selector: 'app-salary',
  standalone: true,
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css'],
  providers: [DatePipe],
  imports: [TranslateModule, ReactiveFormsModule, ConfirmnDeleteDialogComponent, ModernTableComponent, CommonModule, DatePipe, DynamicModalComponent, DeletePopUpComponent]
})

export class SalaryComponent implements OnInit {
  employeeId: number = 0;
  activeTab: string = 'Entitlements';
  todayDate: string = "";
  currentPageDropDown = 1;
  updatedGrossSalary: number = 0;
  dropDownData: any[] = [];
  financial: any[] = [];
  columns: string[] = ['amount', 'benefitTypeName'];
  companyId = Number(localStorage.getItem('companyId'));
  salaryTypeId!: number;
  benefitTypes: any[] = [];
  benefitForm!: FormGroup;
  isSalaryAssigned: boolean = false;
  benefitToDelete: { id: number; companyId: number } | null = null;
  showDeleteModal: boolean = false;
  showEditModal: boolean = false;
  formData: any = {};
  pageIndex: any = {
    employeeSalary: 1,
  };
  totalRows: any = {
    employeeSalary: 0,
  };
  showModal: boolean = false;
  structure = [
    { name: 'name', label: 'Name In Arabic', type: 'text', required: true },
    { name: 'nameAr', label: 'Name In English', type: 'text', required: true },
    { name: 'model', label: 'Model', type: 'text', required: true },
    { name: 'mainAssetId', label: 'Asset', type: 'text', required: true },
  ];
  form!: FormGroup;
  modalId = 'salary-modal'; // Unique ID for the dynamic modal
  deleteId = 'delete-salary-benefit'; // Unique ID for delete modal
  isEdit = false; // Track if the modal is for edit or add
  entityTypes: Record<string, { delete: string; load?: string }> = {
    employeeSalary: {
      delete: 'deleteBenefit', // Maps to the delete method in BenefitTypeService
      load: 'getEmployeeBenefits', // Optional: if you want to use it for loading
    },
  };
  constructor(
    private toast: ToastrService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private salaryTypeService: SalaryTypeService,
    private fb: FormBuilder,
    private toastersService: ToastersService,
    private datePipe: DatePipe,
    private benefitTypeService: BenefitTypeService,
    private benefitService: BenefitService,
    private dialog: MatDialog,
  ) {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.initForm();
    this.initBenefitForm();
    this.getSalary();
    this.loadBenefitTypes();
    this.loadEmployeeBenefits();
    this.route.paramMap.subscribe(params => {
      const employeeId = params.get('id');
      if (employeeId) {
        this.employeeId = Number(employeeId);
      }
    });
  }


  initForm(): void {
    this.form = this.fb.group({
      employeeId: [this.employeeId],
      netSalary: ['', [Validators.required]],
    });
  }

  submitSalary() {
    if (!this.isSalaryAssigned) {
      this.isSalaryAssigned = true;

      const salaryData = {
        employeeId: this.employeeId,
        netSalary: this.form.value.netSalary,
        grossSalary: this.form.value.netSalary,
      };

      this.employeeService.assginEmployeeSalary(salaryData).subscribe(
        (res) => {
          this.isSalaryAssigned = false;
          this.toast.success(
            this.translate.instant('employeeDetails.SALARY_ASSIGN_SUCCESS')
          );
          this.getSalary();
        },
      );
    }
  }



  initFormWithSalary(salary: Salary) {
    this.form.patchValue(salary);
  }

  getSalary() {
    this.employeeService.loadEmployees({ id: this.employeeId }).subscribe(
      (res: EmployeeResponse) => {
        const { grossSalary, netSalary } = res.data.list[0];
        this.updatedGrossSalary = Number(grossSalary);
        this.initFormWithSalary({ grossSalary, netSalary });
      }
    );
  }



  loadBenefitTypes() {
    this.benefitTypeService.getBenefitsType().subscribe(
      (response) => {
        if (response.status === 200) {
          this.benefitTypes = response.data.list;
        }
      },
    );
  }
  submitAddBenefit(): void {
    if (this.benefitForm.invalid) {
      this.benefitForm.markAllAsTouched();
      return;
    }

    const benefitData = {
      ...this.benefitForm.value,
      employeeId: this.employeeId,
      benefitTypeId: Number(this.benefitForm.value.benefitTypeId),
    };

    this.benefitService.addEmployeeBenefit(benefitData).subscribe(
      (response) => {
        if (response.status === 200) {
          this.toast.success('Benefit added successfully');

          const newBenefit = response.data;

          this.financial.push({
            id: newBenefit.id,
            amount: newBenefit.amount,
            benefitTypeId: newBenefit.benefitTypeId,
            benefitTypeName: newBenefit.benefitTypeName,
          });

          this.totalRows['employeeSalary'] = this.financial.length;

          this.updateGrossSalary();
          this.loadEmployeeBenefits();
          this.resetForm();
        }
      },
    );
  }

  submitBenefit(): void {
    if (this.benefitForm.invalid) {
      this.benefitForm.markAllAsTouched();
      return;
    }

    const benefitData = {
      ...this.benefitForm.value,
      id: this.formData.id,
      employeeId: this.employeeId,
      companyId: this.companyId,
    };

    this.benefitService.editBenefit(benefitData).subscribe(
      (response) => {
        if (response.status === 200) {
          this.toast.success('Benefit updated successfully');
          this.closeModal();
          this.loadEmployeeBenefits();
        }
      },
    );
  }

  updateGrossSalary() {
    const totalBenefitAmount = this.financial.reduce(
      (sum, benefit) => sum + benefit.amount,
      0
    );
    const currentNetSalary = Number(this.form.value.netSalary || 0);
    const calculatedGrossSalary = currentNetSalary + totalBenefitAmount;
    if (calculatedGrossSalary !== this.updatedGrossSalary) {
      this.updatedGrossSalary = calculatedGrossSalary;
      const updatedSalaryData = {
        employeeId: this.employeeId,
        netSalary: currentNetSalary,
        grossSalary: this.updatedGrossSalary,
      };
      this.employeeService.assginEmployeeSalary(updatedSalaryData).subscribe(
        (res) => {
          this.getSalary();
        },
      );
    }
  }


  initBenefitForm(): void {
    this.benefitForm = this.fb.group({
      employeeId: [this.employeeId],
      benefitTypeId: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      companyId: [this.companyId]
    });
  }

  // loadEmployeeBenefits(page: number = 1, pageSize: number = 10) {
  //   const request = {
  //     employeeId: this.employeeId,
  //     page,
  //     pageSize,
  //   };
  //   this.benefitService.GetEmployeeBenefit(request).subscribe(
  //     (res: any) => {
  //       if (res.status === 200) {
  //         this.financial = res.data.list.map((benefit: Benefit) => ({
  //           ...benefit,
  //           benefitTypeName: benefit.benefitTypeName,
  //         }));
  //         this.totalRows['employeeSalary'] = res.data.total;
  //         const totalBenefitAmount = this.financial.reduce(
  //           (sum, benefit) => sum + benefit.amount,
  //           0
  //         );
  //         this.updateGrossSalary();
  //       }
  //     },
  //   );
  // }

  loadEmployeeBenefits(page: number = 1, pageSize: number = 10, search?: string): void {
    const params = {
      employeeId: this.employeeId,
      page,
      pageSize,
      search,
    };

    this.benefitService.GetEmployeeBenefit(params).subscribe((response: any) => {
      if (response.status === 200) {
        this.financial = response.data.list;
        this.totalRows['employeeSalary'] = response.data.total;
      }
    });
  }

  openDeleteConfirmation(benefitId: number, companyId: number): void {
    this.benefitToDelete = { id: benefitId, companyId };
  }



  resetForm(): void {
    this.benefitForm.reset();
    this.isEdit = false;
  }


  deleteEntity(entity: string, id: number): void {
    const methodName = this.entityTypes[entity]?.delete as keyof BenefitTypeService;

    if (methodName) {
      (this.benefitTypeService[methodName] as Function)(id, this.companyId).subscribe(
        (response: any) => {
          // Reload the table data after deletion
          this.loadEmployeeBenefits(this.pageIndex['employeeSalary']);
        },

      );
    } else {
      console.error(`No delete method defined for entity: ${entity}`);
    }
  }

  openEditModal(item: any): void {
    this.formData = { ...item }; // Populate form data for editing
    this.showEditModal = true; // Show the edit modal
  }
  // Handle add modal opening
  openAddModal(): void {
    this.isEdit = false;
    this.formData = {};
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.formData = {};
  }
  openDeleteModal(item: { id: number; companyId: number }) {
    this.benefitToDelete = item;
    this.showDeleteModal = true;
  }



  closeModal(): void {
    this.showModal = false;
    this.isEdit = false;
    this.formData = {};
  }
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.benefitToDelete = null;
  }
  confirmDelete(): void {
    if (this.benefitToDelete) {
      this.benefitService.deleteBenefit(this.benefitToDelete.id, this.benefitToDelete.companyId).subscribe(() => {
        this.loadEmployeeBenefits();
        this.closeDeleteModal();
      });
    }
  }
  handleFormSubmission(data: any): void {
    if (this.isEdit) {
      this.benefitService.editBenefit(data).subscribe(() => {
        this.loadEmployeeBenefits();
        this.closeModal();
      });
    } else {
      this.benefitService.addEmployeeBenefit(data).subscribe(() => {
        this.loadEmployeeBenefits();
        this.closeModal();
      });
    }
  }
  cancelDelete() {
    this.closeDeleteModal();
  }
}