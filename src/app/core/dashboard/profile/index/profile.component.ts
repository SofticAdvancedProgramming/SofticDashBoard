import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileCardsComponent } from '../../components/profile-cards/profile-cards.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,ProfileCardsComponent,RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
