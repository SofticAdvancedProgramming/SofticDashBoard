import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company } from '../../../../../../models/company';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent {
  @Input() company!: Company;
  @Input() cityName: string = '';
  @Input() countryName: string = '';

  constructor(private translate: TranslateService) { }
  get isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}


