import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddPositionComponent } from '../add-position/add-position.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, AddPositionComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  isAdd: boolean = false;
  @Input()companyId?:string=''
  addPosition(): void {
    this.isAdd = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    console.log('Action emitted:', isAdd);
  }
}
