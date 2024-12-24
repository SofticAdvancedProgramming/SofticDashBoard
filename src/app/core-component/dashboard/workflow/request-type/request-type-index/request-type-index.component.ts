import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AddRequestTypeComponent } from '../add-request-type/add-request-type.component';
import { RequestTypeDetailsComponent } from '../request-type-details/request-type-details.component';
import { RequestTypeService } from '../../../../../services/requestTypeService/request-type.service';

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
    RequestTypeDetailsComponent,
  ],
  templateUrl: './request-type-index.component.html',
  styleUrl: './request-type-index.component.css',
})
export class RequestTypeIndexComponent implements OnInit {
  activeTab: string = 'add-request';

  requestTypeId!: any;
  requestTypes: any[] = [];
  constructor(private requestTypeService:RequestTypeService) {}
  ngOnInit(): void {
    this.getRequestTypes();
  }

  getRequestTypes() {
    this.requestTypeService.getRequestType({pageSize:1000}).subscribe({
      next: (res) => {
        this.requestTypes = res.data.list;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  up(requestType: any) {}
  down(requestType: any) {}
  deleterequestType(requestType: any) {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
