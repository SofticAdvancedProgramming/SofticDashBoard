import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { employee } from '../../../models/employee';
import { EmployeeService } from '../../services/employeeService/employee.service';
import { AssetsService } from '../../services/AssetsService/assets.service';
import { DropDownComponent } from "../../core-component/dashboard/components/drop-down/drop-down.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chang-status-assets-popup',
  standalone: true,
  imports:[DropDownComponent, CommonModule, FormsModule],
  templateUrl: './chang-status-assets-popup.component.html',
  styleUrl: './chang-status-assets-popup.component.css'
})
export class ChangStatusAssetsPopupComponent {

  @Input() assetId: number = 0;
  @Output() closeAssignAssets = new EventEmitter<boolean>();
  assetsStatus:{name:string,id:number}[]=[{name:'On Duty',id:1},{name:'Out of service',id:2},{name:'Out of service depreciation',id:3}];
  selectedStatus!: number;
  @Output() onChange = new EventEmitter<employee>();

  constructor(private assetService: AssetsService) { }

  ngOnInit() {
    console.log('Asset ID:', this.assetId);
  }

  closePopup() {
    this.closeAssignAssets.emit(false);
  }
  Submit() {
    this.changeStatus();
    this.closePopup();
  }

  onStatusSelect(selectedStatusId: number) {
    this.selectedStatus=selectedStatusId;
    console.log('Selected Employee:', selectedStatusId);
  }

changeStatus(){
  this.assetService.changrStatus(this.assetId,this.selectedStatus).subscribe(
    {
      next:(res)=>{console.log(res)}
    }
  )
}
}
