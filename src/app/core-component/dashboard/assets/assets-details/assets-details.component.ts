import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignAssetPopupComponent } from "../../../../common-component/assign-asset-popup/assign-asset-popup.component";
import { TranslateService } from '@ngx-translate/core';
import { AssetsService } from '../../../../services/AssetsService/assets.service';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { Asset } from '../../../../../models/assets';
import { MapComponent } from '../../../../common-component/map/map.component';
import { HttpClient } from '@angular/common/http';

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
  private accessToken = 'pk.eyJ1IjoiYWRoYW1rYW1hbDIyMzQ1IiwiYSI6ImNtMHVvNjM1dDBpenUyaXFzb21tM2JiOWkifQ.wXQZpp_tsqdoiqZAl9PbpQ'

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private assetsService: AssetsService,
    private http: HttpClient,

    private localStorageService: LocalStorageService,
  ) { }
selectedAssetAddress: string = '';
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
            this.getAddressFromCoordinates(asset.lat, asset.long);  
          } else {
            this.selectedAssetAddress = 'Address not available';
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

  getAddressFromCoordinates(lat: number, long: number) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${this.accessToken}`;
    
    this.http.get(url).subscribe({
      next: (response: any) => {
        if (response.features && response.features.length > 0) {
          this.selectedAssetAddress = response.features[0]?.place_name; // Directly using place_name
          console.log('Fetched Address:', this.selectedAssetAddress);
        } else {
          this.selectedAssetAddress = 'Address not available';
        }
      },
      error: (error: any) => {
        console.error('Error fetching address:', error);
        this.selectedAssetAddress = 'Address not available';
      },
      complete: () => {
        console.log('Address fetch complete');
      }
    });
  }
  
}
