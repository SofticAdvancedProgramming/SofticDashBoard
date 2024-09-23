import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [CommonModule , TranslateModule],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent {

}
