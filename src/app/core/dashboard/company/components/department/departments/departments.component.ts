import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BasicTableComponent } from "../../../../components/basic-table/basic-table.component";

@Component({
    selector: 'app-departments',
    standalone: true,
    templateUrl: './departments.component.html',
    styleUrl: './departments.component.css',
    imports: [CommonModule,
        FormsModule,
        RouterModule, BasicTableComponent, RouterOutlet]
})
export class DepartmentsComponent {
  cards = Array.from({ length: 3 }, (_, i) => ({
    title: `UI UX Designer ${i + 1}`,
    department: 'Designing Department'
  }));
  active: boolean = true;
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
