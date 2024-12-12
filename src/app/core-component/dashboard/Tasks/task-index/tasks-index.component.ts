
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tasks-index',
  standalone: true,
  imports: [TranslateModule, RouterLink, RouterLinkActive],
  templateUrl: './tasks-index.component.html',
  styleUrl: './tasks-index.component.css'
})
export class TasksIndexComponent {
  search(){}
}
