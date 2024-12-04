import { Component } from '@angular/core';
import { TranslateService , TranslateModule} from '@ngx-translate/core';
import { FilterPopupComponent } from '../../../../common-component/filter-popup/filter-popup.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AssetsService } from '../../../../services/AssetsService/assets.service';
import { Assets } from '../../../../../models/assetsModel';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';

@Component({
  selector: 'app-show-assets',
  standalone: true,
  imports: [TranslateModule , FilterPopupComponent,CommonModule,RouterLink],
  templateUrl: './show-assets.component.html',
  styleUrl: './show-assets.component.css'
})
export class ShowAssetsComponent {

  isFilterPopupVisible = false;

  assets: Assets[] = [];
  assetsCategory:{
        name: string,
        nameAr: string,
        mainAssetId: number,
        id: number,
        companyId: number
      }[]=[];

  itemsPerPage: number = 10;

  constructor(
    private translate: TranslateService,
    private assetsService: AssetsService,
    private localStorageService: LocalStorageService,
  ) {
    this.getAssetsCategory(1);
    this.gettAssets();
  }
  get isArabic(): boolean {
    return localStorage.getItem('lang') === 'ar';
  }

  getAssetsCategory(page: number){
    const companyId = Number(this.localStorageService.getItem('companyId'));
    const params = {
      companyId,
      pageIndex: page,
      pageSize: this.itemsPerPage,
    };
    this.assetsService.getMainAssetsCategory(params).subscribe(
      res=>{
        this.assetsCategory=res.data.list;
        console.log(res.data.list);
        console.log( this.assetsCategory);
      }
    )
  }
  gettAssets(){
    this.assetsService.getAsset().subscribe({
      next:(res=>{
        console.log(res.data.list);
        this.assets=res.data.list;
      }
    ),
      error:(err=>{ console.log(err)})
    })
  }

  // Toggle the visibility of the filter popup
  toggleFilterPopup() {
    this.isFilterPopupVisible = !this.isFilterPopupVisible;
  }

  // Handle the close event from the filter popup
  onFilterPopupClose(isVisible: boolean) {
    this.isFilterPopupVisible = isVisible;
  }
}
