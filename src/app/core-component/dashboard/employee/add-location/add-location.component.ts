import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModernTableComponent } from '../../components/modern-table/modern-table.component';
import { employee } from '../../../../../models/employee';
import { Location } from '../../../../../models/Location';
import { MapComponent } from '../../../../common-component/map/map.component';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LocationCardComponent } from '../../../../common-component/location-card/location-card.component';
declare var bootstrap: any;
@Component({
  selector: 'app-add-location',
  standalone: true,
  imports: [ModernTableComponent, RouterLink, FormsModule, CommonModule, PaginationModule, TranslateModule,MapComponent,ReactiveFormsModule,LocationCardComponent],
  templateUrl: './add-location.component.html',
  styleUrl: './add-location.component.css'
})
export class AddLocationComponent implements OnInit{
  companyId: number = 0;
  id: number = 0;
  locations: Location[] = [];
  location!: Location;
  filteredLocations: Location[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalRows: number = 0;
  employee: employee = {} as employee;
  private unsubscribe$ = new Subject<void>();
  form: FormGroup;
  editMode:boolean=false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef){
      this.form = this.fb.group({
         attendanceDateFrom:['', Validators.required],
        attendanceDateTo:['', Validators.required],
        long: [0, Validators.required],
        lat: [0, Validators.required]
      });
    }

  ngOnInit(): void {
    this.companyId = Number(localStorage.getItem('companyId'));
    this.route.paramMap.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      this.id = Number(params.get('id'));
      this.getEmployee();
    });
    this.loadEmployeeAllLocations();
  }
  getEmployee() {
    this.employeeService.loadEmployees({ id: this.id }).pipe(
      tap((response: any) => {
        this.employee = response.data.list[0];
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  loadEmployeeAllLocations()
  {
    if (this.companyId) {
      this.employeeService.loadEmployeeLocations({
        companyId: this.companyId,
        pageSize:  this.itemsPerPage,
        pageIndex: this.currentPage,
        employeeId:this.id
      }).pipe(
        tap((response: any) => {
          this.locations = response.data.list;
          this.filteredLocations = [...this.locations];
          this.totalRows = response.data.totalRows;
          this.cdr.detectChanges();
        })
      ).subscribe(res=>{console.log(res)});

    } else {
      console.warn('No company found in local storage');
    }
  }
  onSave()
  {
    const date = new Date();
    const locaton:Location= {
      id: 0,
      attendanceDateFrom:  this.form.value.attendanceDateFrom,
      attendanceDateTo: this.form.value.attendanceDateTo,
      companyId:this.companyId,
      long: this.form.value.long,
      lat: this.form.value.lat,
      employeeId:this.id
    };
    console.log(locaton);
    this.employeeService.assignEmployeeLocation(locaton).subscribe({
      next: (response) => {
        console.log('Location added successfully', response);
        this.loadEmployeeAllLocations();
          this.form.reset()
        },
      error:(err)=>{
        console.log('Location added failed', err);
      }
    });
  }
  onCancel()
  {
    this.editMode=false;
  }
  onLocationSelected(location: { lat: number, lng: number }): void {
    console.log(location)
    this.form.patchValue({ lat: location.lat, long: location.lng });
  }
  openAddLocationModal() {
    const modalElement = document.getElementById('addLocationModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  editLocation(_location:Location){
    this.location=_location;
    this.editMode=true;
    console.log(_location);
    const modalElement = document.getElementById('addLocationModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
  onUpdate()
  {
    if(this.editMode){
    const locaton:Location= {
      id: this.location.id,
      attendanceDateFrom:  this.form.value.attendanceDateFrom,
      attendanceDateTo: this.form.value.attendanceDateTo,
      companyId:this.companyId,
      long: this.form.value.long,
      lat: this.form.value.lat,
      employeeId:this.id
    };
    console.log(locaton);
    this.employeeService.EditEmployeeAttendanceLocation(locaton).subscribe({
      next: (response) => {
        console.log('Location updated successfully', response);
        this.loadEmployeeAllLocations();
          this.form.reset()
          this.editMode=false;
        },
      error:(err)=>{
        console.log('Location updated failed', err);
      }
    });}
  }
  removeLocation(_location:Location){
    console.log(_location);
    this.employeeService.dleteEmployeeAttendanceLocation(Number(_location?.companyId),Number(_location?.id))
    .subscribe({
      next:(res)=> {console.log('Location deleted successfully', res);
        this.loadEmployeeAllLocations();
      },
      error:(res)=>{console.log('Location deleted faild', res);
        this.loadEmployeeAllLocations();
      }

    })
    //this.OnDeleteLocation.emit(event);
  }

}
