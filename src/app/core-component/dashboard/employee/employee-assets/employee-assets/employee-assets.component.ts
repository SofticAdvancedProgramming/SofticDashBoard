import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AssetsService } from '../../../../../services/AssetsService/assets.service';
import { LocalStorageService } from '../../../../../services/local-storage-service/local-storage.service';
import { FilterPopupComponent } from '../../../../../common-component/filter-popup/filter-popup.component';
import { forEach } from 'lodash';

@Component({
  selector: 'app-employee-assets',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    RouterLink,
    FormsModule,
    PaginationModule,
    FilterPopupComponent,
  ],
  templateUrl: './employee-assets.component.html',
  styleUrl: './employee-assets.component.css',
})
export class EmployeeAssetsComponent implements OnInit {
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
  filteredCategory: {
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
  employeeId: number | null = null;

  constructor(
    private translate: TranslateService,
    private assetsService: AssetsService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {
    this.companyId = Number(localStorage.getItem('companyId'));
  }

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.route.queryParams.subscribe((res) => {
      console.log(res);
    });
    this.getAssetsCategory();
    this.getAssets();
  }

  getAssetsCategory(page?: number) {
    const companyId = Number(this.localStorageService.getItem('companyId'));
    let params = {
      companyId,
      pageIndex: this.page,
      pageSize: this.itemsPerPage,
    };
    this.assetsService.getMainAssetsCategory(params).subscribe((res)=> {
      this.assetsCategory = res.data.list;
      this.totalPages = res.data.totalPages;
      // console.log(res.data.list);
      // console.log( this.assetsCategory);
    });
  }
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

    query = {
      assetCategoryId: event,
      pageSize: this.itemsPerPage,
      pageIndex: page,
      employeeId: this.employeeId
    };
    if (isAssigned != undefined) {
      query = {
        assetCategoryId: event,
        pageSize: this.itemsPerPage,
        pageIndex: page,
        isAssgined: isAssigned,
        employeeId: this.employeeId
      };
    }
    //console.log(this.employeeId);

    // console.log(query)
    this.assetsService.getAsset(query).subscribe({
      next: (res) => {
        // console.log(res.data.list);
        this.assets = res.data.list;
        this.filteredAssets = this.assets;
        this.totalRows = res.data.totalRows;

        const assetsCategoryIds=this.assets.map(asset=> asset.assetCategoryId);
        //console.log(this.assets)
        this.filterCategory(assetsCategoryIds);

         // this.assets.some(asset => asset.assetsCategoryId === item.id))
         // console.log(item)

        //console.log(this.filteredCategory)
        //console.log(this.assetsCategory)
        //console.log(assetsCategoryIds)
      },
      error: (err) => {
      //  console.log(err);
      },
    });
  }

  filterCategory(assetsCategoryIds:any[]){
    for(let i=0 ;i< assetsCategoryIds.length;i++){
      for(let j=0;j<this.assetsCategory.length;j++){
        console.log(this.assetsCategory[j]);
        if(assetsCategoryIds[i]==this.assetsCategory[j].id&&this.filteredCategory.length<= assetsCategoryIds.length){
          this.filteredCategory.push(this.assetsCategory[j])
        }
      }
      }
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
      query = { companyId: this.companyId, pageIndex: this.page , employeeId: this.employeeId };
    }
    console.log(this.employeeId);

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
    let query: any = { companyId: this.companyId, pageIndex: this.page , employeeId: this.employeeId};
    query;
    this.assetsService
      .getAsset({
        companyId: this.companyId,
        pageIndex: this.page,
        name: this.searchText.trim(),
        employeeId: this.employeeId
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
