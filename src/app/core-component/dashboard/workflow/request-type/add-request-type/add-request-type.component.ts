import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownComponent } from '../../../components/drop-down/drop-down.component';

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
export class AddRequestTypeComponent {
  form!:FormGroup;
  files:any[]=[];
  attachmentfileType:any;
  Branchs:any[]=[];
  Departments:any[]=[];
  DepartmentPage:any;
  BranchPage:any;
  requestTypes:any[]=[];
  requestTypeId!:any;

  isFieldInvalid(str:string){

  }
  onBranchSelect(event:any){}
  loadBranchs(){
    
  }
  loadDepartments(){}
  onDepartmentSelect(event:any){}
  onAttachmentChange(event:any){}
  up(requestType:any){}
  down(requestType:any){}
  deleterequestType(requestType:any){}
}
