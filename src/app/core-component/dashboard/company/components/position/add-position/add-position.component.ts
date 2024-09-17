import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-add-position',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.css'],
  providers: [MessageService],
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
  loading: boolean = true;

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
    this.loadDepartmentsAndPositions();
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
    })
  }

  loadPositionTypes(): void {
    this.positionTypeService.getPositionTypes({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.positionType = response.data.list;
        this.checkLoadingState();
      }
    });
  }

  loadDepartmentsAndPositions(): void {
    this.departmentsService.getDepartment({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.departments = response.data.list;
        this.loadPositions(); // Ensure positions are loaded after departments
      }
    });
  }

  loadPositions(): void {
    this.positionService.getPosition({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.positions = response.data.list.map((position: any) => ({
          ...position,
          departmentName: this.getDepartmentName(position.departmentId)
        }));
        this.checkLoadingState();
      }
    });
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
    this.createOrEdit(positionData)
  }

  createOrEdit(positionData: Position) {
    this.positionService[this.isEdit ? 'editPosition' : 'addPosition'](positionData).subscribe({
      next: (response) => {
        console.log('Position added successfully', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.isEdit ? 'Position Edit successfully' : 'Position added successfully' });
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

  trackByPositionId(index: number, item: any): number {
    return item.id;
  }

  trackByDepartmentId(index: number, item: Department): number {
    return item.id!;
  }
}
