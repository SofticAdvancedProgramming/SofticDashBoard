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
import { ChangStatusAssetsPopupComponent } from '../../../../common-component/chang-status-assets-popup/chang-status-assets-popup.component';
import { ConfirmnDeleteDialogComponent } from "../../../../common-component/confirmn-delete-dialog/confirmn-delete-dialog.component";
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-show-assets',
    standalone: true,
    templateUrl: './show-assets.component.html',
    styleUrl: './show-assets.component.css',
    imports: [
        TranslateModule,
        FilterPopupComponent,
        CommonModule,
        RouterLink,
        FormsModule,
        PaginationModule,
        ChangStatusAssetsPopupComponent,
        ConfirmnDeleteDialogComponent
    ]
})
export class ShowAssetsComponent implements OnInit {
  isFilterPopupVisible = false;
  isChangeStatusPopupVisible=false;
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
  isAssined!: boolean;
  isConfirmationDialogVisible: boolean = false;
  assetToDeleteId!: number;
  constructor(
    private translate: TranslateService,
    private assetsService: AssetsService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private toastr: ToastrService, 
  ) {
    this.companyId = Number(localStorage.getItem('companyId'));
    this.getAssetsCategory();

  }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      if (res['isAssined'] != undefined) {
        this.isAssined = res['isAssined'];
      }
    });
    this.gettAssets();
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

    });
  }
  gettAssets(event?:any,i?:number,page=this.currentPage){
    let query;
    if(i!=null){
      this.setActiveButton(i);
    }
    query={"assetCategoryId":event, pageSize: this.itemsPerPage, pageIndex: page,isAssgined:this.isAssined }
    if(this.isAssined!=undefined){
      query={"assetCategoryId":event, pageSize: this.itemsPerPage, pageIndex: page,isAssgined:this.isAssined }
    }
    console.log(query)
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

   toggleFilterPopup() {
    this.isFilterPopupVisible = !this.isFilterPopupVisible;
  }
  editedAssetsId!:number;
  toggleChangStatusPopup(assetId:number){
    this.editedAssetsId=assetId;
    this.isChangeStatusPopupVisible=!this.isChangeStatusPopupVisible
  }

    delete(id:number){
      console.log(id)
      this.assetsService.deleteAsset(id,this.companyId).subscribe({
        next:(res)=>{console.log(res);
          this.gettAssets();}
      })
    }
   onFilterPopupClose(isVisible: boolean) {
    this.isFilterPopupVisible = isVisible;
  }
  onChangeStatusPopupClose(isVisible: boolean) {
    this.isChangeStatusPopupVisible = isVisible;
  }
  applyFilterPopup(event: any) {
    console.log('Received Data:', event);

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
    } else if (isDrived) {
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

  clear(){
    this.page=1
    this.getAssetsCategory(this.page);
    this.gettAssets();
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.getAssetsCategory(this.page++);
    }
  }

  handlePageChange(event: { page: number }) {
    this.currentPage = event.page;
    this.gettAssets( );
  }
  setActiveButton(index: number): void {
    this.activeButtonIndex = index;
  }
  isAssignAssetVisible = false;
  toggleAssignPopup() {
    this.isAssignAssetVisible = !this.isAssignAssetVisible;
  }
  showDeleteConfirmation(assetId: number) {
    this.assetToDeleteId = assetId;
    this.isConfirmationDialogVisible = true;
  }

  handleDeleteConfirm() {
    this.delete(this.assetToDeleteId);
    this.isConfirmationDialogVisible = false;
  }

  handleDeleteCancel() {
    this.isConfirmationDialogVisible = false;
  }
  showCannotDeleteToast(employeeName: string) {
    this.toastr.warning(
      `This asset is assigned to ${employeeName}. You cannot delete it.`,
      'Delete Not Allowed'
    );
  }
}
