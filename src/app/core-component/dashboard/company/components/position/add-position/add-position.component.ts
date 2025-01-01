import { Component, Output, EventEmitter, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PositionTypeService } from '../../../../../../services/lockupsServices/positionTypeService/position-type.service';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { PositionService } from '../../../../../../services/positionService/position.service';
import { Department } from '../../../../../../../models/department';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Position } from '../../../../../../../models/positionModel';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { firstValueFrom, map, Observable } from 'rxjs';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';
import { branch } from '../../../../../../../models/branch';
import { DropDownComponent } from '../../../../components/drop-down/drop-down.component';
import { CompanyService } from '../../../../../../services/comapnyService/company.service';

@Component({
  selector: 'app-add-position',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, ReactiveFormsModule, RouterLink, TranslateModule,DropDownComponent],
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.css'],
  providers: [MessageService],
})
export class AddPositionComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() positionData: Position | any;
  @Input() _branchId: number | any;
  @Output() action = new EventEmitter<boolean>();
  @Input() companyId?: any;
  positionType: any[] = [];
  branches:branch[]=[];
  departments: Department[] = [];
  positions: any[] = [];
  form: FormGroup;
  loading: boolean = true;
  positionTypePage:number=1;
  hasCenterlizedDepartment:boolean=false;
  

  constructor(
    private fb: FormBuilder,
    private positionTypeService: PositionTypeService,
    private departmentsService: DepartmentService,
    private branchsService: BranchService,
    private positionService: PositionService,
    private messageService: MessageService,
    private translate: TranslateService,
    private employeeService:EmployeeService,
    private cd:ChangeDetectorRef,
    private companyService:CompanyService
  ) {
    this.branchId=0;
    this.departmentId=0;
    this.form = this.fb.group({
      positionType: ['', Validators.required],
      branch: ['', Validators.required],
      department: ['', Validators.required],
      position: [{ value: '', disabled: true }],
      isDirectManager: [false],
      centerlizedDepartment:[false]
    });
  }

  ngOnInit(): void {
    this.loadPositionTypes();
   

    this.togglePositionField();
    if (this.isEdit) {
      this.initForm();
    }
    this.checkIsCenteralizedCompany();

  }

  initForm() {
    this.branchId=this._branchId;
    this.departmentId=this.positionData.departmentId
    this.form.patchValue({
      positionType: this.positionData.positionTypeId,
      department: this.positionData.departmentId,
      position:!this.positionData.positionManagerId?'': this.positionData.positionManagerId,
      isDirectManager: this.positionData.positionManagerId !== null,
      branch:this._branchId,
      centerlizedDepartment:this.positionData.isCentralized
    })
  }

  loadPositionTypes(): void {
    this.positionTypeService.getPositionTypes({ companyId: this.companyId,pageSize:20 }).subscribe({
      next: (response) => {
        this.positionType = response.data.list
        // const newItems = response.data.list
        // this.positionType = newItems;
       
        // if(response.data.totalRows>this.positionTypePage*10){
        //   this.positionTypePage++
        //   this.positionType=[...this.positionType,...newItems]
        // }

        this.checkLoadingState();
      }
    });
  }

  loadBranches(): void {
    this.branchsService.getBranch({ companyId: this.companyId,pageSize:20  }).subscribe({
      next: (response) => {
        
        this.branches = response.data.list;
        this.loadDepartmentsAndPositions(); // Ensure positions are loaded after departments
      }
    });
  }
  loadDepartmentsAndPositions(): void {
    
    if(this.hasCenterlizedDepartment &&this.form.get('centerlizedDepartment')?.value)
    {
      this.departmentsService.getDepartment({ companyId: this.companyId ,pageSize:20,isCentralized:true }).subscribe({
        next: (response) => {
          this.departments = response.data.list;
       
         // Ensure positions are loaded after departments
        }
      });
    }
    else
    {
      
      this.departmentsService.getDepartment({ companyId: this.companyId,branchId:+this.branchId ,pageSize:20 }).subscribe({
        next: (response) => {
          this.departments = response.data.list;
     
         // Ensure positions are loaded after departments
        }
      });

    
    }
   
  }

  async loadPositions(): Promise<void> {


    this.positionService.getPosition({ companyId: this.companyId,departmentId:this.departmentId ,pageSize:20 }).subscribe({
      next: async (response) => {

        const positionList = response.data.list || [];
        let filteredPositions = positionList;
    
        if(this.isEdit){
        
          filteredPositions = positionList.filter((item:any)=>item.id!=this.positionData.id)
        }
       
        // Use Promise.all to resolve all employee names
        const positionsWithEmployeeNames = await Promise.all(
          filteredPositions.map(async (position: any) => {
            const employeeName = await this.getPositionEmployee(position.id); // Resolve the employee name
            return {
              ...position,
              departmentName: this.getDepartmentName(position.departmentId),
              employeeName, // Add the resolved employee name
            };
          })
        );

        this.positions = positionsWithEmployeeNames;
        
        this.checkLoadingState();
      }
    });
  }

  async getPositionEmployee(id: number): Promise<string> {
    const response = await firstValueFrom(this.employeeService.getEmployees({ positionId: id }));
    if (response.data.list.length > 0) {
      return response.data.list[0].firstName + " " + response.data.list[0].lastName;
    }
    return "Unassigned";
  }

  getDepartmentName(departmentId: number): string {
    
    const department = this.departments.find(dep => dep.id === departmentId);
    return department?.name ?? 'Unknown';
  }

  checkLoadingState(): void {
    if (this.positionType.length && this.departments.length && this.positions.length) {
      this.loading = false;
    }
  }

  togglePositionField(): void {
    this.form.get('isDirectManager')?.valueChanges.subscribe(isDirectManager => {
      if (isDirectManager) {
        this.form.get('position')?.enable();
        this.loadPositions();
      } else {
        this.form.get('position')?.disable();
      }
    });
  }

  onSave(): void {
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }
    const positionData: Position = {
      id: this.isEdit ? this.positionData.id : 0,
      companyId: Number(this.companyId),
      positionTypeId: parseInt(this.form.value.positionType, 10),
      departmentId: parseInt(this.form.value.department, 10),
      positionManagerId: this.form.value.isDirectManager ? parseInt(this.form.value.position, 10) : null,
      isCentralized:this.form.value.centerlizedDepartment
    };
    this.createOrEdit(positionData);

    this.action.emit(false);
    this.cd.detectChanges();
    this.ngOnInit();
  
  }

  createOrEdit(positionData: Position) {
    this.positionService[this.isEdit ? 'editPosition' : 'addPosition'](positionData).subscribe({
      next: (response) => {
         this.messageService.add({ severity: 'success', summary: 'Success', detail: this.isEdit ? 'Position Edit successfully' : 'Position added successfully' });
        if (!this.isEdit) {
          this.form.reset();
        } else {
          setTimeout(() => {
            this.action.emit(false);
            this.ngOnInit();
          }, 1000);
        }
      }
    });
  }

  onBack(): void {
    this.action.emit(false);
  }

  trackByPositionId(index: number, item: any): number {
    return item.id;
  }

  trackByDepartmentId(index: number, item: Department): number {
    return item.id!;
  }

  trackByBranchId(index: number, item: branch): number {
    return item.id;
  }
  branchId!:number
  departmentId!:number;
  GetBranch(event:any){
    
    this.departmentId=0;
    this.branchId=event.target.value;
    if(this.isEdit){
      this.form.patchValue({
        positionType: this.positionData.positionTypeId,
        department: 0,
        isDirectManager: false
      })
      this.loadDepartmentsAndPositions();
    }else{

      this.loadDepartmentsAndPositions();
    }
  }
  GetDepartment(event:any){
 
    this.departmentId=event.target.value
    this.loadPositions();
  }

  checkIsCenteralizedCompany()
  {
    let companyId = Number(localStorage.getItem("companyId"));
    if(companyId)
    {
      let body={
        id:companyId
      }
      this.companyService.getCompany(body).subscribe({
        next:companyData=>{
          this.hasCenterlizedDepartment=companyData.data.list[0].centralizedDepartment;
          this.loadBranches();
        }
      })
    }
  }
  getDepartments()
  {
    const centerlized = this.form.get('centerlizedDepartment')?.value;
    
    
    
        const branchControl = this.form.get('branch');
    
        if (centerlized) {
          // When centerlizedDepartment is true, remove the 'required' validator
          branchControl?.clearValidators();
          this.form.get('department')?.setValue('0')
          
        } else {
          // When centerlizedDepartment is false, apply the 'required' validator
          branchControl?.setValidators(Validators.required);
        }
    
        // Re-evaluate the validity of the 'branch' control after changing validators
        branchControl?.updateValueAndValidity();

    this.loadDepartmentsAndPositions();
  }
}
