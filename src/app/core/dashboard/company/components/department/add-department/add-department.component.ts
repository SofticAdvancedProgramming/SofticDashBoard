import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../../../../components/map/map.component';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [CommonModule, FormsModule, MapComponent],
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent {
  @Output() action = new EventEmitter<any>();

  departmentLong: number = 0;
  departmentLat: number = 0;

  onSave(): void {
    const departmentData = {
      long: this.departmentLong,
      lat: this.departmentLat,
      // other department details
    };
    this.action.emit(departmentData);
  }

  onBack(): void {
    this.action.emit(false);
  }

  onLocationSelected(location: { lat: number, lng: number }): void {
    this.departmentLat = location.lat;
    this.departmentLong = location.lng;
  }
}
