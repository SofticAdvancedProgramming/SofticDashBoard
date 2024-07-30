import { Component, Output, EventEmitter, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PositionTypeService } from '../../../../../../services/lockupsServices/positionTypeService/position-type.service';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { Department } from '../../../../../../../models/department';


interface Position{
  id:number,
  name:string,
  nameAr:string
}

@Component({
  selector: 'app-add-position',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.css']
})
export class AddPositionComponent implements OnInit {
  @Output() action = new EventEmitter<boolean>();
  @Input() companyId?: string = '';
  types: Position[] = [];
  departments: Department[] = [];
  selectedPositionId: string = '';
  selectedDepId: string = '';
  positionTypeService = inject(PositionTypeService);
  departmentsService = inject(DepartmentService);

  ngOnInit(): void {
    this.loadPositionTypes();
  }

  loadPositionTypes(): void {
    this.positionTypeService.getPositionTypes({companyId:this.companyId}).subscribe({
      next: (response) => {
        this.types = response.data.list;
      },
      error: (err) => {
        console.error('Error loading position types', err);
      }
    });
  }
  loadDepartments(): void {
    this.departmentsService.getDepartment({companyId:this.companyId}).subscribe({
      next: (response) => {
        this.departments = response.data.list;
      },
      error: (err) => {
        console.error('Error loading position types', err);
      }
    });
  }

  onSave(): void {
    this.action.emit(false);
  }

  onBack(): void {
    this.action.emit(false);
  }

  trackById(index: number, item: Position): number {
    return item.id;
  }
}
