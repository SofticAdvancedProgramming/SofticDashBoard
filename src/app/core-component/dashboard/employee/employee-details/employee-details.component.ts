import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { PersonalInformationComponent } from "../employeeDetailsComponents/personal-information/personal-information.component";
import { AdvancedInformationComponent } from "../employeeDetailsComponents/advanced-information/advanced-information.component";
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { tap, catchError, of } from 'rxjs';
import { employee } from '../../../../../models/employee';
import { accountStatus } from '../../../../../models/enums/accountStatus';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css',
  imports: [RouterLink, MatTabsModule, CommonModule, PersonalInformationComponent, AdvancedInformationComponent]
})
export class EmployeeDetailsComponent implements OnInit {
  activeTab: string = 'personal';
  id:Number=0
  employee:employee={} as employee
  accountStatus = accountStatus
  constructor(private route: ActivatedRoute,private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
       this.id = Number(params.get('id'));
      console.log('Employee ID from URL:',   this.id);
    });
    this.getEmployee()
  }
  getEmployee(){
    this.employeeService.loadEmployees({
      id:  this.id
    }).pipe(
      tap((response: any) => {
        this.employee=response.data.list[0]
        console.log("Loaded employee",this.employee)
      }),
      catchError((error: any) => {
        console.error('Error loading employees', error);
        return of([]);
      })
    ).subscribe();
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  onImageError(event: any) {
    event.target.src = '../../../../assets/images/default.jpeg';
  }

}
