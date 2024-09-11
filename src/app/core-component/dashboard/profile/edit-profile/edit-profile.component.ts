import { Component, ElementRef, ViewChild } from '@angular/core';
import { CustomInputComponent } from '../../components/custom-input/custom-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../../services/authenticationService/authentication.service';
import { UserService } from '../../../../services/user/user-service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CustomInputComponent, CommonModule, FormsModule, TranslateModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  public user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : {};
  public userId = +localStorage.getItem('userId')!;
  public roles = JSON.parse(localStorage.getItem('roles')!);
  base64String = '';
  userData: any = {}
  fileExtension = '';
  // location: string = 'Ramses–St.Cloud,Bk';
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedImageUrl: string | null = null;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
  ) {
    this.getPersonalInformation();
  }

  getPersonalInformation() {
    this.authService.getPersonalInformation({ id: this.userId }).subscribe({
      next: (userResponse) => {
        this.selectedImageUrl = userResponse.list[0]?.profileImage || null;
        this.userData = userResponse.list[0];
        localStorage.setItem('user', JSON.stringify(this.userData));
      }
    });
  }

  onEditClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const validImageTypes = ['image/jpeg', 'image/png'];
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!validImageTypes.includes(file.type)) {
        console.error('Invalid file type. Only JPEG and PNG are allowed.');
        return;
      }

      this.fileExtension = file.name.split('.').pop()?.toLowerCase()!;
      this.previewImage(file);
      this.convertToBase64(file).then((base64String: string) => {
        this.uploadImage(base64String);
      });
    }
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  uploadImage(base64String: string): void {
    delete this.userData.passportPhoto;
    delete this.userData.nationalIdPhoto;
    delete this.userData.referancePhoto;
    this.userData.profileImage = base64String!.split(',')[1];
    this.userData.profileImageExtension = this.fileExtension;

    this.authService.editUser(this.userData).subscribe({
      next: (userResponse) => {
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        this.userService.setUser(userResponse.data);
      }
    });
  }


  save() {
    delete this.userData.passportPhoto;
    delete this.userData.nationalIdPhoto;
    delete this.userData.referancePhoto;
    delete this.userData.profileImage;
    //
    console.log(this.userData);
    this.authService.editUser(this.userData).subscribe({
      next: (userResponse) => {
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        this.userService.setUser(userResponse.data);
      }
    });
  }
}
