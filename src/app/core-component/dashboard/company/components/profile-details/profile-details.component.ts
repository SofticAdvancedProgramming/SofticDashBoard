import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company } from '../../../../../../models/company';


@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent {
  @Input() company!: Company;
  @Input() cityName: string = '';
  @Input()countryName: string = '';

  constructor() {
  }

}
