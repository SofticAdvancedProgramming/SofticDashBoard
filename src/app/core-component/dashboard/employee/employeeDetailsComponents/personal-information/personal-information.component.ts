import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from '../../../../../services/userDataService/user-data.service';
import { PersonalInformation } from '../../../../../../models/user';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent implements OnInit {
  personalInfo: PersonalInformation | null = null;
  employeeId: number | null = null;

  rotationDegrees: number = 0;
  isRotated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    private translate: TranslateService
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

          if (this.personalInfo.birthDate === '0001-01-01T00:00:00') {
            // Handle invalid date
          }
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

  getGenderTranslation(): string {
    return this.personalInfo?.gender === 0 ? 'personalInfo.MALE' : 'personalInfo.FEMALE';
  }

  rotateImage(direction: 'left' | 'right') {
    const rotateBy = direction === 'left' ? -90 : 90;
    this.rotationDegrees = (this.rotationDegrees + rotateBy) % 360;
    this.isRotated = true;
  }

  saveRotatedImage() {
    if (!this.personalInfo?.referancePhoto) {
      console.error('No reference photo available to rotate');
      return;
    }

    const imgUrl = this.personalInfo.referancePhoto;


    fetch(imgUrl)
      .then(response => response.blob())
      .then(blob => {
        const img = new Image();
        const objectURL = URL.createObjectURL(blob);
        img.src = objectURL;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const degrees = this.rotationDegrees;

          if (degrees === 90 || degrees === 270) {
            canvas.width = img.height;
            canvas.height = img.width;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }

          ctx?.translate(canvas.width / 2, canvas.height / 2);
          ctx?.rotate((degrees * Math.PI) / 180);
          ctx?.drawImage(img, -img.width / 2, -img.height / 2);


          let base64Image = canvas.toDataURL('image/png');


          base64Image = base64Image.split(',')[1];

          if (this.personalInfo?.referancePhoto) {
            this.personalInfo.referancePhoto = base64Image;
          }
          this.isRotated = false;
          this.rotationDegrees = 0;
       if(this.personalInfo?.referancePhoto){
        this.personalInfo.referancePhoto = base64Image;
        this.updatePersonalInformation();
       }

          console.log('Base64 image without prefix:', this.personalInfo?.referancePhoto);
        };

        img.onerror = () => {
          console.error('Failed to load image');
        };
      })
      .catch(error => {
        console.error('Error fetching the image as Blob:', error);
      });
  }
  updatePersonalInformation() {


    const updatedPersonalInfo: Partial<PersonalInformation> = { ...this.personalInfo };
      delete updatedPersonalInfo.nationalIdPhoto;
      delete updatedPersonalInfo.passportPhoto;
      delete updatedPersonalInfo.profileImage;
    this.userDataService.editPersonalInformation(updatedPersonalInfo).subscribe(
      (response) => {
        console.log('Personal information updated successfully', response);
      }
    );
  }
}
