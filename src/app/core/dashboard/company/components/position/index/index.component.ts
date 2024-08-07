import { Component, OnInit, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddPositionComponent } from '../add-position/add-position.component';
import { PositionService } from '../../../../../../services/positionService/position.service';
import { CommonModule } from '@angular/common';
import { AssignEmployeesComponent } from '../../../../employee/assign-employees/assign-employees.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, AddPositionComponent, AssignEmployeesComponent, CommonModule], // Add the new component here
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [PositionService]
})
export class IndexComponent implements OnInit {
  isAdd: boolean = false;
  isAddEmployee: boolean = false;
  selectedPositionId?: string;
  @Input() companyId?: string = '';
  positions: any[] = [];

  constructor(private positionService: PositionService) { }

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.positionService.getPosition({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.positions = response.data.list;
      },
      error: (err) => {
      }
    });
  }

  addPosition(): void {
    this.isAdd = true;
  }

  addEmployee(positionId: string): void {
    this.selectedPositionId = positionId;
    this.isAddEmployee = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    console.log('Action emitted:', isAdd);
  }

  closePopup(): void {
    this.isAddEmployee = false;
  }
}
