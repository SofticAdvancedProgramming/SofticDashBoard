import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-cards.component.html',
  styleUrl: './profile-cards.component.css'
})
export class ProfileCardsComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() percentage: string = '';
  @Input() cardClass: string = '';
  @Input() bgColor: string = '#FFFFFF';
  @Input() icon: string = '';
  @Input() updateDate: string = ''; 
}
