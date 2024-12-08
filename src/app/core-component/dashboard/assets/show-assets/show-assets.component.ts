import { Component, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FilterPopupComponent } from '../../../../common-component/filter-popup/filter-popup.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssetsService } from '../../../../services/AssetsService/assets.service';
import { Assets } from '../../../../../models/assetsModel';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';
import { FormsModule } from '@angular/forms';
import { search } from '@tensorflow/tfjs-core/dist/io/composite_array_buffer';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { any } from '@tensorflow/tfjs-core';

@Component({
  selector: 'app-show-assets',
  standalone: true,
  imports: [
    TranslateModule,
    FilterPopupComponent,
    CommonModule,
    RouterLink,
    FormsModule,
    PaginationModule,
  ],
  templateUrl: './show-assets.component.html',
  styleUrl: './show-assets.component.css',
})
export class ShowAssetsComponent implements OnInit {
  isFilterPopupVisible = false;
  companyId: number = 0;
  assets: any[] = [];
  filteredAssets: any[] = [];
  assetsCategory: {
    name: string;
    nameAr: string;
    mainAssetId: number;
    id: number;
    companyId: number;
  }[] = [];
  itemsPerPage: number = 10;
  totalPages: number = 1;
  page: number = 1;
  searchText: string = '';
  currentPage: number = 1;
  totalRows: number = 0;
  activeButtonIndex: number | null = null;
   isAssined!:boolean;
  
  constructor(
    private translate: TranslateService,
    private assetsService: AssetsService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {
    this.companyId = Number(localStorage.getItem('companyId'));
    this.getAssetsCategory();
   }

  ngOnInit(): void {

    this.route.params.subscribe(res=>{
      if(res['isAssined']!=undefined){
        this.isAssined=res['isAssined'];
       // console.log(res)
      }
      //console.log(res)
     // console.log(this.isAssined)
      this.gettAssets();
    })
    this.gettAssets();
=======
    this.getAssets();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      console.log(res);
    });
   }

  getAssetsCategory(page?: number) {
    const companyId = Number(this.localStorageService.getItem('companyId'));
    const params = {
      companyId,
      pageIndex: this.page,
      pageSize: this.itemsPerPage,
    };
    this.assetsService.getMainAssetsCategory(params).subscribe((res) => {
      this.assetsCategory = res.data.list;
      this.totalPages = res.data.totalPages;
      // console.log(res.data.list);
      // console.log( this.assetsCategory);
    });
  }
   gettAssets(event?:any,i?:number,page=this.currentPage){
   getAssets(
    event?: any,
    i?: number,
    page = this.currentPage,
    isAssigned?: boolean
  ) {
     let query;
    if (i != null) {
      this.setActiveButton(i);
    }

     query={"assetCategoryId":event, pageSize: this.itemsPerPage, pageIndex: page,isAssgined:this.isAssined  }

   // console.log(query)
     query = {
      assetCategoryId: event,
      pageSize: this.itemsPerPage,
      pageIndex: page,
    };
    if (isAssigned != undefined) {
      query = {
        assetCategoryId: event,
        pageSize: this.itemsPerPage,
        pageIndex: page,
        isAssgined: isAssigned,
      };
    }
    // console.log(event)
     this.assetsService.getAsset(query).subscribe({
      next: (res) => {
        // console.log(res.data.list);
        this.assets = res.data.list;
        this.filteredAssets = this.assets;
        this.totalRows = res.data.totalRows;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Toggle the visibility of the filter popup
  toggleFilterPopup() {
    this.isFilterPopupVisible = !this.isFilterPopupVisible;
  }

  // Handle the close event from the filter popup
  onFilterPopupClose(isVisible: boolean) {
    this.isFilterPopupVisible = isVisible;
  }
  applyFilterPopup(event: any) {
    console.log('Received Data:', event);

    // Extract individual values
    const assetName = event.name;
    const isAssigned: boolean = event.isAssigned;
    console.log(isAssigned)
    const assetCategoryId = event.AssetCategory;
    const isDrived: boolean = event.isDrived;
    let query: any = { companyId: this.companyId, pageIndex: this.page };
    if (assetName) {
      query = {
        companyId: this.companyId,
        pageIndex: this.page,
        name: assetName.trim(),
      };
    } else if (assetCategoryId) {
      query = {
        companyId: this.companyId,
        pageIndex: this.page,
        assetCategoryId: assetCategoryId,
      };
    } else if (assetName && assetCategoryId) {
      query = {
        companyId: this.companyId,
        pageIndex: this.page,
        name: assetName,
        assetCategoryId: assetCategoryId,
      };
    } else if (isAssigned) {
      query = {
        companyId: this.companyId,
        pageIndex: this.page,
        isAssgined: isAssigned,
      };
    } else if (assetName && assetCategoryId && isAssigned) {
      query = {
        companyId: this.companyId,
        pageIndex: this.page,
        name: assetName,
        assetCategoryId: assetCategoryId,
        isAssgined: isAssigned,
      };
    }else if (isDrived) {
      query = {
        companyId: this.companyId,
        pageIndex: this.page,
        isDrived: isDrived,
      };
    } else {
      query = { companyId: this.companyId, pageIndex: this.page };
    }
    this.assetsService.getAsset(query).subscribe({
      next: (res) => {
        this.assets = res.data.list;
        this.filteredAssets = this.assets;
        this.totalRows = res.data.totalRows;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  applyFilter() {
    let query: any = { companyId: this.companyId, pageIndex: this.page };
    query;
    this.assetsService
      .getAsset({
        companyId: this.companyId,
        pageIndex: this.page,
        name: this.searchText.trim(),
      })
      .subscribe({
        next: (res) => {
          this.assets = res.data.list;
          this.filteredAssets = this.assets;
          this.totalRows = res.data.totalRows;
        },
        error: (err) => {
          console.log(err);
        },
      });

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

  prevPage() {
    if (this.page > 1) this.getAssetsCategory(this.page--);
  }

  clear() {
    this.page = 1;
    this.getAssetsCategory(this.page);
    this.getAssets();
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.getAssetsCategory(this.page++);
    }
  }

  handlePageChange(event: { page: number }) {
    this.currentPage = event.page;
    this.getAssets();
  }

  setActiveButton(index: number): void {
    this.activeButtonIndex = index;
  }
}
