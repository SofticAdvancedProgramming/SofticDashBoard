import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModernTableComponent } from "../../components/modern-table/modern-table.component";
import { RouterLink } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { branch } from '../../../../../models/branch';

@Component({
    selector: 'app-view-employees',
    standalone: true,
    templateUrl: './view-employees.component.html',
    styleUrl: './view-employees.component.css',
    imports: [ModernTableComponent ,RouterLink]
})
export class ViewEmployeesComponent {
    @Output() action = new EventEmitter<boolean>();
      branches: branch[] = [];
    @Input() companyId?: number ;
}
