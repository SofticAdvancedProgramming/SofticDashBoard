import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AddRequestTypeComponent } from "../add-request-type/add-request-type.component";
import { RequestTypeDetailsComponent } from '../request-type-details/request-type-details.component';

@Component({
  selector: 'app-request-type-index',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AddRequestTypeComponent,
    RequestTypeDetailsComponent
],
  templateUrl: './request-type-index.component.html',
  styleUrl: './request-type-index.component.css'
})
export class RequestTypeIndexComponent {
  activeTab: string = 'add-request';

  requestTypeId!:any;
  requestTypes:any[]=[];

  up(requestType:any){}
  down(requestType:any){}
  deleterequestType(requestType:any){}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
