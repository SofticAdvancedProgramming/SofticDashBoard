import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from '../../../../../services/userDataService/user-data.service';
import { PersonalInformation } from '../../../../../../models/user';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

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
  safeImageUrl: SafeUrl | null = null;
  safeRotationStyle: SafeStyle | null = null;
  defaultImageUrl: string = 'assets/images/default.jpeg';
  rotatedImageDataUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
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
    const requestPayload = { id: this.employeeId };

    this.userDataService.loadPersonalInformation(requestPayload).subscribe(
      (response) => {
        if (response?.list?.length > 0) {
          this.personalInfo = response.list[0] as PersonalInformation;
          this.setImageUrl(this.personalInfo.referancePhoto);
        }
      },
      (error) => {
        console.error('Error loading personal information:', error);
      }
    );
  }

  setImageUrl(url: string): void {

      // It's a URL, fetch the image
      this.http.get(new URL(url).pathname, { responseType: 'blob' })
        .pipe(
          map((blob: any) => {
            const objectUrl = URL.createObjectURL(blob);
            return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          }),
          catchError(error => {
            console.error('Error fetching image:', error);
            return of(this.sanitizer.bypassSecurityTrustUrl(this.defaultImageUrl));
          })
        )
        .subscribe((safeUrl: SafeUrl) => {
          this.safeImageUrl = safeUrl;
          this.updateRotationStyle();
        });

  }

  updateRotationStyle(): void {
    this.safeRotationStyle = this.sanitizer.bypassSecurityTrustStyle(`rotate(${this.rotationDegrees}deg)`);
  }

  onImageError(event: any) {
    event.target.src = this.defaultImageUrl;
  }

  getGenderTranslation(): string {
    return this.personalInfo?.gender === 0 ? 'personalInfo.MALE' : 'personalInfo.FEMALE';
  }

  rotateImage(direction: 'left' | 'right') {
    const rotateBy = direction === 'left' ? -90 : 90;
    this.rotationDegrees = (this.rotationDegrees + rotateBy) % 360;
    this.updateRotationStyle();
    this.isRotated = true;
  }

  saveRotatedImage() {
    if (!this.safeImageUrl) {
      console.error('No image available to rotate');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      img.src = this.safeImageUrl?.toString()||'';
      // Rotate and draw the image on the canvas
      ctx?.translate(canvas.width / 2, canvas.height / 2);
      ctx?.rotate((this.rotationDegrees * Math.PI) / 180);
      ctx?.drawImage(img, -img.width / 2, -img.height / 2);
console.log(img.src);

      // Get the rotated image as base64
      this.rotatedImageDataUrl = canvas.toDataURL('image/png');

      // Send base64 data without the prefix to API
      const base64DataWithoutPrefix = this.rotatedImageDataUrl.replace(/^data:image\/(png|jpg);base64,/, '');
      if (this.personalInfo) {
        this.personalInfo.referancePhoto = base64DataWithoutPrefix;
        this.updatePersonalInformation();
      }

      // Use the full base64 string for display
      this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.rotatedImageDataUrl);

      this.isRotated = false;
      this.rotationDegrees = 0;
      this.updateRotationStyle();
    };

    img.onerror = (error) => {
      console.error('Failed to load the image for rotation:', error);
      this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.defaultImageUrl);
    };

    img.src = this.sanitizer.sanitize(SecurityContext.URL, this.safeImageUrl) || '';
  }

  updatePersonalInformation() {
    if (this.personalInfo) {
      const updatedPersonalInfo: Partial<PersonalInformation> = { ...this.personalInfo };
      updatedPersonalInfo.nationality = '';
      updatedPersonalInfo.maritalStatus = '';
      delete updatedPersonalInfo.nationalIdPhoto;
      delete updatedPersonalInfo.passportPhoto;
      delete updatedPersonalInfo.profileImage;

      this.userDataService.editPersonalInformation(updatedPersonalInfo).subscribe(
        (response) => {
          console.log('Personal information updated successfully', response);
        },
        (error) => {
          console.error('Error updating personal information:', error);
        }
      );
    }
  }

  get referancePhotoSrc(): string {
    if (this.rotatedImageDataUrl && this.rotatedImageDataUrl.startsWith('data:image')) {
      return this.rotatedImageDataUrl;
    } else if (this.personalInfo?.referancePhoto && this.personalInfo.referancePhoto.startsWith('data:image')) {
      return this.personalInfo.referancePhoto;
    } else if (this.personalInfo?.referancePhoto) {
      return this.personalInfo.referancePhoto;
    } else {
      return this.defaultImageUrl;
    }
  }
}
