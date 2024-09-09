import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-active-companies',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './active-companies.component.html',
  styleUrl: './active-companies.component.css'
})
export class ActiveCompaniesComponent {
  companies = ['IOBTE Company', 'Al madany Company', 'QNP Company'];

constructor(private translate: TranslateService) {


}
}
