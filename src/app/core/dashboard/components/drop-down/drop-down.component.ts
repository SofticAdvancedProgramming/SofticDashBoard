import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class DropDownComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() options: Array<{ value: string, label: string }> = [];
  @Input() placeholder: string = '';
}
