import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownComponent } from '../../../components/drop-down/drop-down.component';
import { RequestTypeService } from '../../../../../services/requestTypeService/request-type.service';

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
  requestId!: number;
  requestTypeDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private requestTypeService: RequestTypeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.requestId = +params['id'];
      this.loadRequestTypeDetails(this.requestId);
    });
  }

  loadRequestTypeDetails(id: number): void {
    // this.requestTypeService.getRequestTypeById(id).subscribe({
    //   next: (res) => {
    //     this.requestTypeDetails = res.data;
    //     console.log('Request Type Details:', this.requestTypeDetails);
    //   },
    //   error: (err) => {
    //     console.error('Error fetching request type details:', err);
    //   },
    // });
  }
}
