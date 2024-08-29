import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../../../../services/userDataService/user-data.service';
import { SocialInfo } from '../../../../../../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {
  socialInfo?: SocialInfo;

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.loadSocialInfo();
  }

  loadSocialInfo(): void {
    const requestPayload = {}; // Adjust payload if necessary

    this.userDataService.loadSocialInfo(requestPayload).subscribe({
      next: (response) => {
        console.log('Full API Response:', response);   
        
         if (response && response.status === 200 && response.data && response.data.list && response.data.list.length > 0) {
          this.socialInfo = response.data.list[0];
          console.log('Extracted Social Info:', this.socialInfo);   
        } else {
          console.error('Failed to fetch social info or no data found.');
          console.log('Response status:', response.status);
          console.log('Response data:', response.data);
        }
      },
      error: (error) => {
        console.error('Error fetching social info:', error);
      }
    });
  }
}
