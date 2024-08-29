import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from '../../../../../services/userDataService/user-data.service';
import { PersonalInformation } from '../../../../../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent implements OnInit {
  personalInfo: PersonalInformation | null = null;
  employeeId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.employeeId) {
      this.loadPersonalInformation();
    } else {
      console.warn('No employee ID found in the route parameters');
    }
  }

  loadPersonalInformation(): void {
    const requestPayload = {
      id: this.employeeId
    };

    this.userDataService.loadPersonalInformation(requestPayload).subscribe(
      (response) => {
        if (response && response.list && response.list.length > 0) {
          this.personalInfo = response.list[0] as PersonalInformation;
          // Check if birthDate is a placeholder or invalid and handle accordingly
          if (this.personalInfo.birthDate === '0001-01-01T00:00:00') {
           }
          console.log(response);
        }
      },
      (error) => {
        console.error('Error loading personal information:', error);
      }
    );
  }
  onImageError(event: any) {
    event.target.src = '../../../../../../assets/images/default.jpeg';
  }

}
