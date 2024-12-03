import { Component } from '@angular/core';
import { TranslateService , TranslateModule} from '@ngx-translate/core';
import { FilterPopupComponent } from '../../../../common-component/filter-popup/filter-popup.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
 
@Component({
  selector: 'app-show-assets',
  standalone: true,
  imports: [TranslateModule , FilterPopupComponent,CommonModule,RouterLink],
  templateUrl: './show-assets.component.html',
  styleUrl: './show-assets.component.css'
})
export class ShowAssetsComponent {

  isFilterPopupVisible = false;

  constructor(private translate: TranslateService) { }

  // Toggle the visibility of the filter popup
  toggleFilterPopup() {
    this.isFilterPopupVisible = !this.isFilterPopupVisible;
  }

  // Handle the close event from the filter popup
  onFilterPopupClose(isVisible: boolean) {
    this.isFilterPopupVisible = isVisible;
  }
}