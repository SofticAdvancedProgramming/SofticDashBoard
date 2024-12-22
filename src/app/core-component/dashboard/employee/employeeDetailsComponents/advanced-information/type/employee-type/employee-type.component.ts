import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeTypeService } from '../../../../../../../services/employeeTypeService/employee-type.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-type',
  standalone: true,
  imports: [TranslateModule, FormsModule, CommonModule],
  templateUrl: './employee-type.component.html',
  styleUrl: './employee-type.component.css'
})
export class EmployeeTypeComponent implements OnInit {
  id!: number;
  employeeType!: any;
  private unsubscribe$ = new Subject<void>();

  constructor(private employeeTypeService: EmployeeTypeService, private route: ActivatedRoute){}
  ngOnInit(): void {
    this.route.paramMap.pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe(params => {
          this.id = Number(params.get('id'));
          this.getEmployeeTypes();
        })
  }
  getEmployeeTypes(){
    this.employeeTypeService.getEmployeeType({userId: this.id}).subscribe({
      next: (res) => {
        console.log(res);
        this.employeeType = res.data.list;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  
}
