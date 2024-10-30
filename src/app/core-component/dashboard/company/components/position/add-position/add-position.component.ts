import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PositionTypeService } from '../../../../../../services/lockupsServices/positionTypeService/position-type.service';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { PositionService } from '../../../../../../services/positionService/position.service';
import { Department } from '../../../../../../../models/department';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Position } from '../../../../../../../models/positionModel';
import { DropDownComponent } from "../../../../../../common-component/drop-down/drop-down.component";

@Component({
    selector: 'app-add-position',
    standalone: true,
    templateUrl: './add-position.component.html',
    styleUrls: ['./add-position.component.css'],
    providers: [MessageService],
    imports: [CommonModule, FormsModule, ToastModule, ReactiveFormsModule, RouterLink, TranslateModule, DropDownComponent]
})
export class AddPositionComponent implements OnInit {
  @Input() isEdit: boolean = false;
  @Input() positionData: Position | any;
  @Output() action = new EventEmitter<boolean>();
  @Input() companyId?: string = '';
  
  positionType: any[] = [];
  departments: Department[] = [];
  positions: any[] = [];
  form: FormGroup;
  
  positionTypePage = 1;
  departmentPage = 1;
  positionPage = 1;
  itemsPerPage = 10;
  loadingMorePositionTypes = false;
  loadingMoreDepartments = false;
  loadingMorePositions = false;
  pageIndex: any;
  constructor(
    private fb: FormBuilder,
    private positionTypeService: PositionTypeService,
    private departmentsService: DepartmentService,
    private positionService: PositionService,
    private messageService: MessageService,
    private translate: TranslateService,
  ) {
    this.form = this.fb.group({
      positionType: ['', Validators.required],
      department: [''],
      position: [{ value: '', disabled: true }, Validators.required],
      isDirectManager: [false]
    });
  }

  ngOnInit(): void {
    this.loadPositionTypes();
    this.loadDepartments();
    this.togglePositionField();
    if (this.isEdit) {
      this.initForm();
    }
  }

  initForm() {
    this.form.patchValue({
      positionType: this.positionData.positionTypeId,
      department: this.positionData.departmentId,
      position: this.positionData.positionManagerId,
      isDirectManager: this.positionData.positionManagerId !== null
    });
  }

  loadPositionTypes(): void {
    if (this.loadingMorePositionTypes) return;
    this.loadingMorePositionTypes = true;
  
    this.positionTypeService.getPositionTypes({
      companyId: this.companyId,
      pageIndex: this.positionTypePage,
      pageSize: this.itemsPerPage
    }).subscribe({
      next: (response) => {
        const newItems = response.data.list.filter((item: any) =>
          !this.positionType.some((existingItem: any) => existingItem.id === item.id)
        );
        this.positionType = [...this.positionType, ...newItems];
        this.loadingMorePositionTypes = false;
        if (newItems.length) this.positionTypePage++;  
      },
      error: () => this.loadingMorePositionTypes = false
    });
  }

  loadDepartments(): void {
    if (this.loadingMoreDepartments) return;
    this.loadingMoreDepartments = true;
  
    this.departmentsService.getDepartment({
      companyId: this.companyId,
      pageIndex: this.departmentPage,
      pageSize: this.itemsPerPage
    }).subscribe({
      next: (response) => {
        const newItems = response.data.list.filter((item: any) =>
          !this.departments.some((existingItem: any) => existingItem.id === item.id)
        );
        this.departments = [...this.departments, ...newItems];
        this.loadingMoreDepartments = false;
        if (newItems.length) this.departmentPage++;
      },
      error: () => this.loadingMoreDepartments = false
    });
  }
  
  loadPositions(): void {
    if (this.loadingMorePositions) return;
    this.loadingMorePositions = true;
  
    this.positionService.getPosition({
      companyId: this.companyId,
      pageIndex: this.positionPage,
      pageSize: this.itemsPerPage
    }).subscribe({
      next: (response) => {
        const newItems = response.data.list.filter((position: any) =>
          !this.positions.some((existingPosition: any) => existingPosition.id === position.id)
        );
        this.positions = [...this.positions, ...newItems];
        this.loadingMorePositions = false;
        if (newItems.length) this.positionPage++;
      },
      error: () => this.loadingMorePositions = false
    });
  }

  loadMorePositionTypes(pageIndex?: number): void {
    this.positionTypePage = pageIndex || this.positionTypePage + 1;
    this.loadPositionTypes();
  }
  
  loadMoreDepartments(page?: number): void {
    this.departmentPage = page || this.departmentPage + 1;
    this.loadDepartments();
  }
  
  loadMorePositions(page?: number): void {
    this.positionPage = page || this.positionPage + 1;
    this.loadPositions();
  }
  

  onPositionTypeChange(value: any) {
    this.form.get('positionType')?.setValue(value);
  }

  onDepartmentChange(value: any) {
    this.form.get('department')?.setValue(value);
  }

  onPositionChange(value: any) {
    this.form.get('position')?.setValue(value);
  }

  togglePositionField(): void {
    this.form.get('isDirectManager')?.valueChanges.subscribe(isDirectManager => {
      if (isDirectManager) {
        this.form.get('position')?.enable();
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
      positionManagerId: this.form.value.isDirectManager ? parseInt(this.form.value.position, 10) : null
    };
    this.createOrEdit(positionData);
  }

  createOrEdit(positionData: Position) {
    this.positionService[this.isEdit ? 'editPosition' : 'addPosition'](positionData).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.isEdit ? 'Position edited successfully' : 'Position added successfully' });
        if (!this.isEdit) {
          this.form.reset();
        } else {
          setTimeout(() => {
            this.action.emit(false);
          }, 1000);
        }
      }
    });
  }

  onBack(): void {
    this.action.emit(false);
  }
}
