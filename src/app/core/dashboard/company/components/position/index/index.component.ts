import { Component, OnInit, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddPositionComponent } from '../add-position/add-position.component';
import { PositionService } from '../../../../../../services/positionService/position.service';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, AddPositionComponent, CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [PositionService]
})
export class IndexComponent implements OnInit {
  isAdd: boolean = false;
  @Input() companyId?: string = '';
  positions: any[] = [];

  constructor(private positionService: PositionService) {}

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.positionService.getPosition({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.positions = response.data.list;
        console.log(" its positions hereeee" ,response)
      },
      error: (err) => {
        console.error('Error loading positions', err);
      }
    });
  }

  addPosition(): void {
    this.isAdd = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    console.log('Action emitted:', isAdd);
  }
}
