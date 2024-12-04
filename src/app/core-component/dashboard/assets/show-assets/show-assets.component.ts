import { Component } from '@angular/core';
import { TranslateService , TranslateModule} from '@ngx-translate/core';
import { FilterPopupComponent } from '../../../../common-component/filter-popup/filter-popup.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AssetsService } from '../../../../services/AssetsService/assets.service';
import { Assets } from '../../../../../models/assetsModel';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';
import { FormsModule } from '@angular/forms';
import { search } from '@tensorflow/tfjs-core/dist/io/composite_array_buffer';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-show-assets',
  standalone: true,
  imports: [TranslateModule , FilterPopupComponent,CommonModule,RouterLink,FormsModule,PaginationModule],
  templateUrl: './show-assets.component.html',
  styleUrl: './show-assets.component.css'
})
export class ShowAssetsComponent {

  isFilterPopupVisible = false;
  assets: any[] = [];
  filteredAssets: any[] = [];
  assetsCategory:{
        name: string,
        nameAr: string,
        mainAssetId: number,
        id: number,
        companyId: number
      }[]=[];
  itemsPerPage: number = 10;
  totalPages:number=1;
  page: number=1;
  searchText: string = '';
  companyId:number=0;
  currentPage: number = 1;
  totalRows: number = 0;
  constructor(
    private translate: TranslateService,
    private assetsService: AssetsService,
    private localStorageService: LocalStorageService,
  ) {
    this.companyId=Number(localStorage.getItem('companyId'));
    this.getAssetsCategory();
    this.gettAssets();
  }

  getAssetsCategory(page?:number){
    const companyId = Number(this.localStorageService.getItem('companyId'));
    const params = {
      companyId,
      pageIndex: this.page,
      pageSize: this.itemsPerPage,
    };
    this.assetsService.getMainAssetsCategory(params).subscribe(
      res=>{
        this.assetsCategory=res.data.list;
        this.totalPages=res.data.totalPages;
        // console.log(res.data.list);
        // console.log( this.assetsCategory);
      }
    )
  }
  gettAssets(event?:any){
    const query={"assetCategoryId":event}
   // console.log(event)
    this.assetsService.getAsset(query).subscribe({
      next:(res=>{
       // console.log(res.data.list);
        this.assets=res.data.list;
        this.filteredAssets= this.assets
        this.totalRows = res.data.totalRows;
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
  applyFilter() {
    let query: any = { companyId: this.companyId, pageIndex:this.page };
    query
    this.assetsService.getAsset({
      companyId: this.companyId,
      pageIndex:this.page,
      name:this.searchText.trim()
    }).subscribe({
      next:(res=>{
        this.assets=res.data.list;
        this.filteredAssets= this.assets
      }
    ),
      error:(err=>{ console.log(err)})
    })


    // if (this.searchText.trim()) {
    // //  console.log(this.searchText)
    //   this.filteredAssets = this.assets.filter(
    //     (asset) =>
    //         asset.assetCategoryName?.toLowerCase()
    //         .includes(this.searchText.toLowerCase()) ||
    //         asset.employeeName?.includes(this.searchText) ||
    //         asset.name?.toLowerCase()
    //         .includes(this.searchText.toLowerCase()) ||
    //         asset.nameAr?.toLowerCase()
    //         .includes(this.searchText.toLowerCase()) ||
    //       ''
    //   );
    // } else {
    //   this.filteredAssets = [...this.assets];
    // }
  }

  get isArabic(): boolean {
    return localStorage.getItem('lang') === 'ar';
  }
  prevPage(){
    if(this.page>1)
    this.getAssetsCategory(this.page--);
  }
  clear(){
    this.page=1
    this.getAssetsCategory(this.page);
    this.gettAssets();
  }
  nextPage(){
    if(this.page<this.totalPages){
      this.getAssetsCategory(this.page++);
    }

  }

  handlePageChange(event: { page: number }) {
    this.currentPage = event.page;
    this.gettAssets();
  }

}
