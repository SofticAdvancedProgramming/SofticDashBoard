import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumbService/breadcrumb.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {
//  {
//   breadcrumbs: string[] = [];
//   constructor(private breadcrumbService: BreadcrumbService) {
//     this.breadcrumbService.breadcrumbs$.subscribe(
//       (crumbs) => (this.breadcrumbs = crumbs)
//     );
//   }
// }
  breadcrumbs: Array<{ label: string, url: string }> = [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbs = this.breadcrumbService.breadcrumbs;
    console.log( this.breadcrumbs)
  }
}
