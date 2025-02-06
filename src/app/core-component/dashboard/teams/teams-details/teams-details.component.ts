import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-teams-details',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './teams-details.component.html',
  styleUrl: './teams-details.component.css'
})
export class TeamsDetailsComponent {
  teamId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log("Received Team ID:", params.get('id'));
    });
  }
}