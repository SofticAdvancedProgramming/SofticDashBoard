import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { employee } from '../../../../../models/employee';  

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ToastModule],
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
  providers: [MessageService]
})
export class ShiftsComponent implements OnInit {
  @Input() employeeId!: number; // ID of the employee to retrieve
  employees: employee[] = [];
  selectedEmployee: employee | null = null; // Store the employee object
  shift = {
    start: '01:30',
    end: '21:30'
  };

  constructor(
    private employeeService: EmployeeService,
    private translate: TranslateService,
    private messageService: MessageService  
  ) {}

  ngOnInit() {
    this.loadEmployeeDetails(this.employeeId);  
  }

  loadEmployeeDetails(employeeId: number) {
    const request = { id: employeeId }; // Change to match expected structure
    this.employeeService.loadEmployeeById(request).subscribe(data => {
      this.selectedEmployee = data.data.list[0]; // Assuming the employee object is inside the list
      if (this.selectedEmployee) {
        if (this.selectedEmployee.startShift) {
          this.shift.start = `${this.selectedEmployee.startShift.hour}:${this.selectedEmployee.startShift.minute}`;
        }
        if (this.selectedEmployee.endShift) {
          this.shift.end = `${this.selectedEmployee.endShift.hour}:${this.selectedEmployee.endShift.minute}`;
        }
      }
      console.log(data);
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load employee details.' });
      console.error('Error loading employee details:', error);
    });
  }

  isValidShift(): boolean {
    const [startHour, startMinute] = this.shift.start.split(':').map(Number);
    const [endHour, endMinute] = this.shift.end.split(':').map(Number);

    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0);

    return startTime <= endTime;
  }

  saveShift() {
    if (!this.isValidShift()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Start shift cannot be after end shift.' });
      return;
    }

    const request = {
      employeeId: this.selectedEmployee?.id,
      startShift: {
        hour: +this.shift.start.split(':')[0],
        minute: +this.shift.start.split(':')[1],
      },
      endShift: {
        hour: +this.shift.end.split(':')[0],
        minute: +this.shift.end.split(':')[1],
      },
    };

    console.log('Request to be sent:', request);

    this.employeeService.assginShift(request).subscribe(response => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Shift assigned successfully.' });
      console.log('Shift assigned successfully:', response);
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to assign shift.' });
      console.error('Error assigning shift:', error);
    });
  }

  cancel() {
    // Logic to cancel the operation (if needed)
  }
}
