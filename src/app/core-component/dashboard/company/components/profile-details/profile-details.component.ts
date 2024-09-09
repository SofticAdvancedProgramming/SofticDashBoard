import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CompanyService } from '../../../../../services/comapnyService/company.service';
import { ImageUploadService } from '../../../../../services/ImageUploadService/image-upload.service';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Company } from '../../../../../../models/company';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxIntlTelInputModule, FormsModule, TranslateModule],
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
  @Input() company!: Company;
  @Input() cityName: string = '';
  @Input()countryName: string = '';

  constructor() {
  }

}
