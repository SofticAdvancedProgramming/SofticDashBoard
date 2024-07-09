import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-deduction-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deduction-component.component.html',
  styleUrls: ['./deduction-component.component.css']
})
export class DeductionComponentComponent {
  @Input() title: string = '';
  @Input() amount: string = '';
  @Input() categories: any[] = [];
  @Input() imgSrc: string | undefined; 
  @Input() bgColor: string | undefined;
}
