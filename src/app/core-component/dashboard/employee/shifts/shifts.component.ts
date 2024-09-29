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
  @Input() employeeId!: number;  
  employees: employee[] = [];
  selectedEmployee: employee | null = null;  
  shift = {
    start: '',  // Remove default shift start time
    end: ''     // Remove default shift end time
  };
  noShiftMessage = 'No Shift';  // Message to display if no shift is set

  constructor(
    private employeeService: EmployeeService,
    private translate: TranslateService,
    private messageService: MessageService  
  ) {}

  ngOnInit() {
    this.loadEmployeeDetails(this.employeeId);  
  }

  loadEmployeeDetails(employeeId: number) {
    const request = { id: employeeId };  
    this.employeeService.loadEmployeeById(request).subscribe({
      next: (data) => {
        console.log('API response:', data);  // Log the API response
        if (data && data.data && data.data.list && data.data.list.length > 0) {
          this.selectedEmployee = data.data.list[0];  // Extract the employee data
          console.log('Selected Employee:', this.selectedEmployee);
          
          if (this.selectedEmployee?.startShift) {
            this.shift.start = this.formatShiftTime(this.selectedEmployee.startShift);
          } else {
            this.shift.start = this.noShiftMessage;  // Display "No Shift" if no startShift
          }
          
          if (this.selectedEmployee?.endShift) {
            this.shift.end = this.formatShiftTime(this.selectedEmployee.endShift);
          } else {
            this.shift.end = this.noShiftMessage;  // Display "No Shift" if no endShift
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No employee data found.' });
        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load employee details.' });
        console.error('Error loading employee details:', error);
      }
    });
  }

   formatShiftTime(shift: { hour: number; minute: number }): string {
    const hour = shift.hour.toString().padStart(2, '0');    
    const minute = shift.minute.toString().padStart(2, '0');  
    return `${hour}:${minute}`;
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
      employeeId: this.selectedEmployee?.id || 0,  // Set the employee ID, default to 0 if null
      startShiftHour: +this.shift.start.split(':')[0],  // Extract hour from start shift
      startShiftMinute: +this.shift.start.split(':')[1],  // Extract minute from start shift
      endShiftHour: +this.shift.end.split(':')[0],  // Extract hour from end shift
      endShiftMinute: +this.shift.end.split(':')[1]  // Extract minute from end shift
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
   }
}