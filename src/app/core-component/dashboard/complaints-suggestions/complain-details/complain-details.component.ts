 import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-complain-details',
  standalone: true,
  imports: [RouterModule,TranslateModule],  
  templateUrl: './complain-details.component.html',
  styleUrls: ['./complain-details.component.css']
})
export class ComplainDetailsComponent implements OnInit {
  id: number | null = null;

  constructor(private route: ActivatedRoute,    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
    });
  }
}
