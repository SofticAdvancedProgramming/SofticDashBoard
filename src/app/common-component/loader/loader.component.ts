import { Component } from '@angular/core';
import { SpinnerService } from '../../core/services/spinner/spinner.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  imports: [],
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  public loading$: boolean = false;
  constructor(public spinner: SpinnerService) {
    this.getLoading();
  }

  getLoading() {
    this.spinner.loading$.subscribe((result) => {
      this.loading$ = result;
    })
  }
}
