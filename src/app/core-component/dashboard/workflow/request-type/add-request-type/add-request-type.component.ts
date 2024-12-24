import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownComponent } from '../../../components/drop-down/drop-down.component';
import { RequestTypeService } from '../../../../../services/requestTypeService/request-type.service';

@Component({
  selector: 'app-add-request-type',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    DropDownComponent,
  ],
  templateUrl: './add-request-type.component.html',
  styleUrl: './add-request-type.component.css'
})
export class AddRequestTypeComponent implements OnInit {
  form!:FormGroup;
  files:any[]=[];
  attachmentfileType:any;
  Branches:any[]=[];
  Departments:any[]=[];
  Positions:any[]=[];
  DepartmentPage:any;
  BranchPage:any;
  PositionPage:any;
  requestTypes:any[]=[];
  requestTypeId!:any;
  selectedBranch: any;
  selectedDepartment: any;
  selectedPosition: any;

  constructor(private requestTypeService:RequestTypeService){}
  ngOnInit(): void {
    this.loadBranchs()
  }

  isFieldInvalid(str:string){

  }
  
  loadBranchs(){
    this.requestTypeService.getBranches({}).subscribe({
      next: (res) => {
        this.Branches = res.data.list;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  onBranchSelect(branchId:any){
    const branch = this.Branches.find((branch: any) => branch.id === branchId);

    if (branch) {
      console.log('Selected Branch:', branch);
      this.selectedBranch = branch;
      this.loadDepartments(this.selectedBranch.id);
      console.log('Selected Branch ID:', this.selectedBranch?.id);
    } else {
      console.log('Branch not found.');
    }
  }
  

  loadDepartments(id:any){
    this.requestTypeService.getDepartments({branchId: id}).subscribe({
      next: (res) => {
        this.Departments = res.data.list;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  onDepartmentSelect(departmentId:any){
    const department = this.Departments.find((department: any) => department.id === departmentId);

    if (department) {
      console.log('Selected department:', department);
      this.selectedDepartment = department;
      this.loadPositions(this.selectedDepartment.id);
      console.log('Selected department ID:', this.selectedDepartment?.id);
    } else {
      console.log('department not found.');
    }
  }

  loadPositions(id:any){
    this.requestTypeService.getPositions({departmentId: id}).subscribe({
      next: (res) => {
        this.Positions = res.data.list;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  onPositionSelect(positionId:any){
    const position = this.Positions.find((position: any) => position.id === positionId);

    if (position) {
      console.log('Selected Position:', position);
      this.selectedPosition = position;
      // this.getSubAssetsCategories(this.selectedAsset.id);
      console.log('Selected Position ID:', this.selectedPosition?.id);
    } else {
      console.log('Position not found.');
    }
  }

  onAttachmentChange(event:any){}
  up(requestType:any){}
  down(requestType:any){}
  deleterequestType(requestType:any){}
}
