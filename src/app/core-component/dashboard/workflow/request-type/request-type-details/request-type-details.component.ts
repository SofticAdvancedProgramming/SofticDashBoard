import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownComponent } from '../../../components/drop-down/drop-down.component';

@Component({
  selector: 'app-request-type-details',
  standalone: true,
  imports:  [
      TranslateModule,
      RouterLink,
      RouterLinkActive,
      ReactiveFormsModule,
      CommonModule,
      FormsModule,
      DropDownComponent,
    ],
  templateUrl: './request-type-details.component.html',
  styleUrl: './request-type-details.component.css'
})
export class RequestTypeDetailsComponent {
  requestType!:any;

  isImage(event:any){}
  isPDF(event:any){}
}
