import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-next-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './next-button.component.html',
  styleUrl: './next-button.component.css'
})
export class NextButtonComponent {
  @Input() routerLink: string = '/';
  @Input() buttonText: string = '';
}
