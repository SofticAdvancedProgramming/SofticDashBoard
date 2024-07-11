import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponentComponent } from '../../components/input-component/input-component.component';
import { DropDownComponent } from '../../components/drop-down/drop-down.component';


@Component({
  selector: 'app-add-company',
  standalone: true,
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css'],
  imports: [
    CommonModule,
    InputComponentComponent,
    DropDownComponent
  ]
})
export class AddCompanyComponent {}
