import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-component',
  standalone: true,
  templateUrl: './input-component.component.html',
  styleUrls: ['./input-component.component.css']
})
export class InputComponentComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() readonly: boolean = false;
}
