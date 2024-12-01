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
  imports: [TranslateModule, ReactiveFormsModule, ModernTableComponent, CommonModule, DatePipe, DynamicModalComponent]
})

export class SalaryComponent implements OnInit {
  structure = [
    { name: 'name', label: 'Benefit Name', type: 'text', required: true },
    { name: 'nameAr', label: 'Benefit Name (Arabic)', type: 'text', required: true }
  ];
  employeeId: number = 0;
  activeTab: string = 'Entitlements';
  todayDate: string = "";
  isEdit = false;
  currentPageDropDown = 1;
  updatedGrossSalary: number = 0;
  dropDownData: any[] = [];
  financial: any[] = [];
  columns: string[] = ['amount', 'benefitTypeName'];
  companyId = Number(localStorage.getItem('companyId'));
  salaryTypeId!: number;
  benefitTypes: any[] = [];
  benefitForm!: FormGroup;
  formData: any = {};
  pageIndex: any = {
    employeeSalary: 1,
  };
  totalRows: any = {
    employeeSalary: 0,
  };
  showModal: boolean = false;

  form!: FormGroup;

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
    private benefitService: BenefitService
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { netSalary } = this.form.value;
    const grossSalary = netSalary;

    const salaryData = {
      employeeId: this.employeeId,
      netSalary,
      grossSalary,
    };

    this.employeeService.assginEmployeeSalary(salaryData).subscribe(
      (res) => {
        this.toast.success(this.translate.instant('employeeDetails.SALARY_ASSIGN_SUCCESS'));
        this.getSalary();
      },
    );
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

    const benefitData = this.benefitForm.value;
    benefitData.employeeId = this.employeeId;
    benefitData.benefitTypeId = Number(benefitData.benefitTypeId);

    this.benefitService.addEmployeeBenefit(benefitData).subscribe(
      (response) => {
        if (response.status === 200) {
          this.toast.success('Benefit added successfully');

          const newBenefit = response.data;

          this.financial.push({
            amount: newBenefit.amount,
            benefitTypeName: newBenefit.benefitTypeName,
          });

          this.totalRows['employeeSalary'] = this.financial.length;

          this.updateGrossSalary();

          this.resetForm();
        }
      },
      (error) => {
        this.toast.error('Error adding benefit');
      }
    );
  }

  submitBenefit(): void {
    if (this.benefitForm.invalid) {
      this.benefitForm.markAllAsTouched();
      return;
    }

    const benefitData = { ...this.benefitForm.value, id: this.formData.id };

    this.benefitService.editBenefit(benefitData).subscribe(
      (response) => {
        if (response.status === 200) {
          this.toast.success('Benefit updated successfully');
          this.closeModal();
        }
      },

    );
  }
  updateGrossSalary() {
    const totalBenefitAmount = this.financial.reduce((sum, benefit) => sum + benefit.amount, 0);

    const currentNetSalary = this.form.value.netSalary;

    this.updatedGrossSalary = currentNetSalary + totalBenefitAmount;

    const updatedSalaryData = {
      employeeId: this.employeeId,
      netSalary: currentNetSalary,
      grossSalary: this.updatedGrossSalary,
    };

    this.employeeService.assginEmployeeSalary(updatedSalaryData).subscribe(
      (res) => {
        this.getSalary();
      }
    );
  }


  initBenefitForm(): void {
    this.benefitForm = this.fb.group({
      employeeId: [this.employeeId],
      benefitTypeId: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      companyId: [this.companyId]
    });
  }

  loadEmployeeBenefits(page: number = 1, pageSize: number = 10) {
    const request = {
      employeeId: this.employeeId,
      page,
      pageSize,
    };
  
    this.benefitService.GetEmployeeBenefit(request).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.financial = res.data.list.map((benefit: Benefit) => ({
            ...benefit,
            benefitTypeName: benefit.benefitTypeName,
          }));
          this.totalRows['employeeSalary'] = res.data.total;
          const totalBenefitAmount = this.financial.reduce((sum, benefit) => sum + benefit.amount, 0);
          this.updateGrossSalary();
        } else {
          this.toast.error('Failed to load employee benefits');
        }
      },
      (error) => {
        this.toast.error('An error occurred while loading employee benefits.');
        console.error('Error loading employee benefits:', error);
      }
    );
  }
  



  deleteBenefit(id: number, companyId: number): void {
    this.benefitService.deleteBenefit(id, companyId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEmployeeBenefits();
        }
      },

    );
  }

  openEditModal(benefit: any): void {
    this.isEdit = true;
    this.formData = { ...benefit };
    this.benefitForm.patchValue({
      benefitTypeId: benefit.benefitTypeId,
      amount: benefit.amount
    });
    this.showModal = true;
  }

  resetForm(): void {
    this.benefitForm.reset();
    this.isEdit = false;
  }
  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }
}