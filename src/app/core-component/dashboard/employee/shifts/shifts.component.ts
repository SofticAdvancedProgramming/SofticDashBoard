import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ModernTableComponent } from '../../components/modern-table/modern-table.component';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ToastModule,ModernTableComponent],
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
  providers: [MessageService]
})
export class ShiftsComponent implements OnInit {
  @Input() employeeId!: number;
  selectedEmployee: any = null;
  shift = { start: '', end: '' };
  noShiftMessage = 'No Shift';
  isDataLoaded = false;

  constructor(
    private employeeService: EmployeeService,
    private translate: TranslateService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadEmployeeDetails(this.employeeId);
  }

  private loadEmployeeDetails(employeeId: number): void {
    const request = { id: employeeId };

    this.employeeService.loadEmployeeById(request).subscribe({
      next: (data) => this.handleEmployeeData(data),
      error: (error) => this.handleLoadError(error)
    });
  }

  private handleEmployeeData(data: any): void {
    if (data?.data?.list?.length > 0) {
      this.selectedEmployee = data.data.list[0];
      this.processShiftData();
    } else {
      this.showMessage('error', 'Error', 'No employee data found.');
    }
    this.isDataLoaded = true;
  }

  private processShiftData(): void {
    this.shift.start = this.selectedEmployee?.startShift
      ? this.parseShiftTime(this.selectedEmployee.startShift)
      : ' ';

    this.shift.end = this.selectedEmployee?.endShift
      ? this.parseShiftTime(this.selectedEmployee.endShift)
      : ' ';
  }

  private handleLoadError(error: any): void {
    this.showMessage('error', 'Error', 'Failed to load employee details.');
    console.error('Error loading employee details:', error);
    this.isDataLoaded = true;
  }

  private parseShiftTime(shiftTime: string | { hour: number; minute: number }): string {
    return typeof shiftTime === 'string'
      ? this.formatShiftTimeFromString(shiftTime)
      : this.formatShiftTimeFromObject(shiftTime);
  }

  private formatShiftTimeFromString(shiftTime: string): string {
    const [hour, minute] = shiftTime.split(':');
    return `${hour}:${minute}`;
  }

  private formatShiftTimeFromObject(shift: { hour: number; minute: number }): string {
    const hour = shift.hour.toString().padStart(2, '0');
    const minute = shift.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }

  private isValidShift(): boolean {
    const startTime = this.createDateFromShift(this.shift.start);
    const endTime = this.createDateFromShift(this.shift.end);
    return startTime <= endTime;
  }

  private createDateFromShift(shift: string): Date {
    const [hour, minute] = shift.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0);
    return date;
  }

  saveShift(): void {
    if (!this.isValidShift()) {
      this.showMessage('error', 'Error', 'Start shift cannot be after end shift.');
      return;
    }

    const request = {
      employeeId: this.selectedEmployee?.id || 0,
      startShiftHour: +(this.shift.start.split(':')[0] || 0),
      startShiftMinute: +(this.shift.start.split(':')[1] || 0),
      endShiftHour: +(this.shift.end.split(':')[0] || 0),
      endShiftMinute: +(this.shift.end.split(':')[1] || 0)
    };

    this.employeeService.assginShift(request).subscribe({
      next: (response) => this.handleShiftSuccess(response),
      error: (error) => this.handleShiftError(error)
    });
  }

  private handleShiftSuccess(response: any): void {
    this.showMessage('success', 'Success', 'Shift assigned successfully.');

  }

  private handleShiftError(error: any): void {
    this.showMessage('error', 'Error', 'Failed to assign shift.');
    console.error('Error assigning shift:', error);
  }

  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

  cancel(): void {

  }

  // columns:any;
  // deleteId: string = 'deleteSalaryBenefit';
  // activeTab: string = 'Entitlements';
  // shifts: any[] = [];
  // totalRows: any = {
  //   employeeSalary: 0,
  // };
  // loadEmployeeshifts(){

  // }

  // deleteSift(id:number, companyId:number){

  // }
  // openEditModal(event:any){}
}
