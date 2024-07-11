import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css'
})
export class DropDownComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() options: { value: string, label: string }[] = [];
  @Input() placeholder: string = '';
}
