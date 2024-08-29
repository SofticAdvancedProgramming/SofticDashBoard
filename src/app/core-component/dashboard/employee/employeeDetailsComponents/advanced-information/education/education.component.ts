import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css',
  animations: [
    trigger('slideToggle', [
      state('void', style({ height: '0px', overflow: 'hidden' })),
      state('*', style({ height: '*', overflow: 'hidden' })),
      transition(':enter', [
        style({ height: '0px', overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*' })),
      ]),
      transition(':leave', [
        style({ height: '*', overflow: 'hidden' }),
        animate('300ms ease-in', style({ height: '0px' })),
      ]),
    ]),
  ]
})
export class HighSchoolComponent {
  isHighSchoolOpen = true;  
  isBachelorDegreeOpen = false;
  toggleHighSchool() {
    this.isHighSchoolOpen = !this.isHighSchoolOpen;
  }

  toggleBachelorDegree() {
    this.isBachelorDegreeOpen = !this.isBachelorDegreeOpen;
  }
}