import { Component } from '@angular/core';
import { CustomInputComponent } from '../../components/custom-input/custom-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CustomInputComponent, CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  fullName: string = 'Alec M. Thompson';
  mobile: string = '01275501908';
  email: string = 'Georgemikhaiel@Gmail.Com';
  location: string = 'Ramses–St.Cloud,Bk';

  save() {
    // Add your save logic here
    console.log('Form saved!', this.fullName, this.mobile, this.email, this.location);
  }
}
