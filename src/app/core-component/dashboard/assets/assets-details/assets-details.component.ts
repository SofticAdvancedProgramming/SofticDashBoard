import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignAssetPopupComponent } from "../../../../common-component/assign-asset-popup/assign-asset-popup.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AssetsService } from '../../../../services/AssetsService/assets.service';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Asset } from '../../../../../models/assets';
import { MapComponent } from '../../../../common-component/map/map.component';
import { HttpClient } from '@angular/common/http';
import { RelatedAssetsPopupComponent } from "../../../../common-component/related-assets-popup/related-assets-popup.component";
import { ConfirmnDeleteDialogComponent } from '../../../../common-component/confirmn-delete-dialog/confirmn-delete-dialog.component';

@Component({
  selector: 'app-assets-details',
  standalone: true,
  templateUrl: './assets-details.component.html',
  styleUrls: ['./assets-details.component.css'],
  imports: [CommonModule,
            AssignAssetPopupComponent,
            MapComponent,
            RelatedAssetsPopupComponent,RouterLink,
            ConfirmnDeleteDialogComponent,
            TranslateModule]
})
export class AssetsDetailsComponent implements OnInit {
  assets: Asset[] = [];
  relatedAssets: Asset[] = [];
  isMainAsset:boolean=true;
  assetsCategory: {
    name: string,
    nameAr: string,
    mainAssetId: number,
    id: number,
    companyId: number
  }[] = [];
  files: { name: string, url: string }[] = [];
  isAssignAssetVisible = false;
  isRelatedAssetsVisible = false;
  selectedAssetLocation: { lat: number, long: number } = { lat: 0, long: 0 };
  deletedrelatedAssetsId!:number;
  childAsset:any;
  private accessToken = 'pk.eyJ1IjoiYWRoYW1rYW1hbDIyMzQ1IiwiYSI6ImNtMHVvNjM1dDBpenUyaXFzb21tM2JiOWkifQ.wXQZpp_tsqdoiqZAl9PbpQ'

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private assetsService: AssetsService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
  ) { }
  selectedAssetAddress: string = '';
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        console.log('Extracted assetId:', id);
        this.gettAssets(Number(id));
        this.getRelatedAssets(Number(id));
      }
    });
  }

  get isArabic(): boolean {
    return localStorage.getItem('lang') === 'ar';
  }
  downloadFile(fileUrl: string) {
    console.log('File URL:', fileUrl);

    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = this.extractFileName(fileUrl);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  extractFileName(fileUrl: string): string {
    return fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
  }
  toggleAssignPopup() {
    this.isAssignAssetVisible = !this.isAssignAssetVisible;
  }
  toggleRelatedAssetsPopup() {
    this.isRelatedAssetsVisible = !this.isRelatedAssetsVisible;
  }
  onRelatedAssetsClose(isVisible: boolean) {
    this.isRelatedAssetsVisible = isVisible;
    this.ngOnInit();
  }
  onAssignAssetClose(isVisible: boolean) {
    this.isAssignAssetVisible = isVisible;
    this.ngOnInit();
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
    console.log('Requesting asset with ID:', id);
    this.assetsService.getAsset(params).subscribe({
      next: (res) => {
        console.log('Assets Response:', res.data.list);
        this.assets = res.data.list.map((asset: any) => {
          // const category = this.assetsCategory.find(cat => cat.id === asset.assetCategoryId);
          // const assetCategoryName = category ? (this.translate.currentLang === 'ar' ? category.nameAr : category.name) : 'Unknown';

          this.files = asset.assetAttachments ? asset.assetAttachments.map((attachment: any) => ({
            name: attachment.file.split('/').pop(),
            url: attachment.file
          })) : [];

          if (asset.lat && asset.long) {
            this.selectedAssetLocation = { lat: asset.lat, long: asset.long };
            this.getAddressFromCoordinates(asset.lat, asset.long);
          } else {
            this.selectedAssetAddress = 'Address not available';
          }
          if(asset.parentAssetId){
            this.isMainAsset=false;}

          return {
            ...asset,
          //  assetCategoryName: assetCategoryName
          };
        });
        console.log('Mapped Assets Array:', this.assets);

        this.getRelatedAssets(id);
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
          this.selectedAssetAddress = response.features[0]?.place_name;
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
  getRelatedAssets(assetId: number) {
    //const params = { assetId };
    const params = { parentAssetId:assetId };
    console.log('Requesting related assets for assetId:', assetId);
   // this.assetsService.getRelatedAssets(params).subscribe({
      this.assetsService.getAsset(params).subscribe({
      next: (res) => {
        console.log('Related Assets Response:', res);
        if (res.data && Array.isArray(res.data.list)) {
          this.relatedAssets = res.data.list;
        } else {
          this.relatedAssets = [];
        }
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching related assets:', err);
        this.relatedAssets = [];
      }
    });
  }
  isConfirmationDialogVisible:boolean=false;

  deleteRelatedAsset(event:Event,assetsid:number){
    event.stopPropagation();
    this.isConfirmationDialogVisible=true;
    this.deletedrelatedAssetsId=assetsid;
    this.getChild();
  }

  handleDeleteConfirm(){
    if(this.childAsset){
 //   console.log(this.deletedrelatedAssetsId);
    this.edit();
    }
  }

  handleDeleteCancel(){
    this.isConfirmationDialogVisible=false;
  }

  getChild(){
    console.log(this.deletedrelatedAssetsId)
    let params={id:this.deletedrelatedAssetsId}
    this.assetsService.getAsset(params).subscribe(
      (res)=>{
        this.childAsset=res.data.list[0];
    //console.log(this.childAsset)
    //  console.log(res)
      },
      (err)=>{console.log(err)}
    )
  }
  edit(){
    console.log(this.childAsset)
    this.childAsset.parentAssetId=null;
    console.log(this.childAsset);
    this.assetsService.edit(this.childAsset).subscribe({
      next:(res)=>{
      //console.log(res);
        this.isConfirmationDialogVisible=false;
        this.ngOnInit();},
      error:(res)=>{console.log(res);}
    })
  }
}
