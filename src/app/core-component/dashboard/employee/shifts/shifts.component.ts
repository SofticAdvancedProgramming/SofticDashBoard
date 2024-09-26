import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
  employees = [];
  selectedEmployee: number = 0;
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
    this.loadEmployees();
    if (this.employeeId !== undefined) {
      this.selectedEmployee = this.employeeId;
    }
  }

  loadEmployees() {
    this.employeeService.loadEmployees({}).subscribe(data => {
      this.employees = data;
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
      employeeId: this.selectedEmployee,
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
   }
}
