import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponentComponent } from "../../components/input-component/input-component.component";
import { AddCompanyComponent } from "../add-company/add-company.component";


@Component({
    selector: 'app-companies',
    standalone: true,
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.css'],
    imports: [CommonModule, InputComponentComponent, AddCompanyComponent]
})
export class CompaniesComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
