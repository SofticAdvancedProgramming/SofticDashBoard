import { Component } from '@angular/core';
import { ModernTableComponent } from "../../components/modern-table/modern-table.component";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-view-employees',
    standalone: true,
    templateUrl: './view-employees.component.html',
    styleUrl: './view-employees.component.css',
    imports: [ModernTableComponent ,RouterLink]
})
export class ViewEmployeesComponent {

}
