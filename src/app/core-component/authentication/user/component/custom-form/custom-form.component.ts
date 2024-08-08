import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from '../../../dashboard/components/custom-input/custom-input.component';
@Component({
  selector: 'app-custom-form',
  standalone: true,
  imports: [CustomInputComponent,CommonModule],
  templateUrl: './custom-form.component.html',
  styleUrl: './custom-form.component.css'
})
export class CustomFormComponent {
  @Input() sectionTitle: string = '';
  @Input() fields: any[] = [];
}
