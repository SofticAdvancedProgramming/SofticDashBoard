import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignAssetPopupComponent } from "../../../../common-component/assign-asset-popup/assign-asset-popup.component";
import { TranslateService } from '@ngx-translate/core';
import { AssetsService } from '../../../../services/AssetsService/assets.service';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { Asset } from '../../../../../models/assets';
import { MapComponent } from '../../../../common-component/map/map.component';

@Component({
  selector: 'app-assets-details',
  standalone: true,
  templateUrl: './assets-details.component.html',
  styleUrls: ['./assets-details.component.css'],
  imports: [CommonModule, AssignAssetPopupComponent, MapComponent]
})
export class AssetsDetailsComponent implements OnInit {
  assets: Asset[] = [];
  assetsCategory: {
    name: string,
    nameAr: string,
    mainAssetId: number,
    id: number,
    companyId: number
  }[] = [];
  isAssignAssetVisible = false;
  selectedAssetLocation: { lat: number, long: number } = { lat: 0, long: 0 };
  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private assetsService: AssetsService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.gettAssets(id);
      }
    });
    this.getAssetsCategory();
  }

  files = [
    { name: 'Laptop Spec Sheet', url: 'assets/files/laptop-spec.pdf' },
    { name: 'User Manual', url: 'assets/files/user-manual.pdf' },
    { name: 'Warranty Information', url: 'assets/files/warranty.pdf' }
  ];

  downloadFile(fileUrl: string) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  toggleAssignPopup() {
    this.isAssignAssetVisible = !this.isAssignAssetVisible;
  }

  onAssignAssetClose(isVisible: boolean) {
    this.isAssignAssetVisible = isVisible;
  }

  getAssetsCategory() {
    const companyId = Number(this.localStorageService.getItem('companyId'));
    const params = { companyId };
    this.assetsService.getMainAssetsCategory(params).subscribe(
      res => {
        this.assetsCategory = res.data.list;
        console.log(res.data.list);
      },
      error => {
        console.error(error);
      }
    );
  }

  gettAssets(id: number) {
    const params = { id };
    this.assetsService.getAsset(params).subscribe({
      next: (res) => {
        console.log('Assets Response:', res.data.list);
        this.assets = res.data.list.map((asset: any) => {
          const category = this.assetsCategory.find(cat => cat.id === asset.assetCategoryId);
          const assetCategoryName = category ? (this.translate.currentLang === 'ar' ? category.nameAr : category.name) : 'Unknown';

          if (asset.lat && asset.long) {
            this.selectedAssetLocation = { lat: asset.lat, long: asset.long };
          } 

          return {
            ...asset,
            assetCategoryName: assetCategoryName
          };
        });
        console.log('Mapped Assets Array:', this.assets);
      },
      error: (err) => {
        console.error('Error fetching assets:', err);
      }
    });
  }

}
