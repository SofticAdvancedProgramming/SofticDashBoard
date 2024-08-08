import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BasicTableComponent } from "../../../../components/basic-table/basic-table.component";

@Component({
    selector: 'app-department-details',
    standalone: true,
    templateUrl: './department-details.component.html',
    styleUrl: './department-details.component.css',
    imports: [CommonModule, RouterLink, BasicTableComponent]
})
export class DepartmentDetailsComponent {
  headers: string[] = ['Department', 'Specialty', 'Manager', 'Position'];
  data = [
    { department: 'Design Department', specialty: 'Designing', manager: 'Yomna Ashraf', position: 'Head Of Department' },
    { department: 'HR Department', specialty: 'People Department managing', manager: 'Nabil Warda', position: 'Head Of Department' },
    { department: 'Development Department', specialty: 'Web developments', manager: 'Geaorge MIKHAIL', position: 'Senior UI/UX Designer' },
    { department: 'Marketing Department', specialty: 'Marketing', manager: 'Mayar', position: 'Senior Mobile' },
    { department: 'Business Development', specialty: 'Data Analyst', manager: 'Aya Salah', position: 'Marketing Coordinator' },
    { department: 'Traveler Department', specialty: 'Ticket Maker', manager: 'Maged Ali', position: 'Marketing Coordinator' },
    { department: 'Treasure Department', specialty: 'React JS Developer', manager: 'Soria Nabil', position: 'Senior UI/UX Designer' }
  ];
  title = 'Departments Overview';
}
