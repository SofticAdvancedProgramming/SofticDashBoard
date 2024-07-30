import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PositionTypeService } from '../../../../../../services/lockupsServices/positionTypeService/position-type.service';
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
export class AddPositionComponent {
  @Output() action = new EventEmitter<boolean>();
  @Input() companyId?:string=''
  types:Position[]=[]
  positionTypeService=inject(PositionTypeService);
  ngOnInit(): void {
    this.loadPositionTypes();
  }

  loadPositionTypes(): void {
    this.positionTypeService.getPositionTypes({companyId:Number(this.companyId)}).subscribe({
      next: (response) => {
        console.log("response:",response)
        this.types = response.data.list;
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
}
