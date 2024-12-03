import { Component, OnInit } from '@angular/core';
import { DropDownComponent } from '../../../components/drop-down/drop-down.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AssetsService } from '../../../../../services/AssetsService/assets.service';
import { MessageService } from 'primeng/api';
import { Assets } from '../../../../../../models/assetsModel';
import { LocalStorageService } from '../../../../../services/local-storage-service/local-storage.service';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-assets-category',
  standalone: true,
  imports: [
    DropDownComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModernTableComponent,
    PaginationModule
  ],
  templateUrl: './assets-category.component.html',
  styleUrl: './assets-category.component.css',
})
export class AssetsCategoryComponent implements OnInit {
  form!: FormGroup;
  formData: any = {};
  assets: any[] = [];
  AssetsData!: Assets;
  lang: string = this.localStorageService.getItem('lang')!;
  totalRows: any = { AssetsCategories: 0 };
  currentPage: number = 1;
  itemsPerPage: number = 10;
  modalId = 'addAssetCategory';
  deleteId: string = 'deleteAssetCategory';
  columns: string[] = ['name' , 'nameAr'];
  companyId = this.localStorageService.getItem('companyId');
  pageIndex: any = {};
  entityTypes: Record<
    string,
    { load: string; add: string; edit: string; delete: string; data: string }
  > = {
    AssetsCategories: {
      load: 'getMainAssetsCategory',
      add: 'addAssetCategory',
      edit: 'editAssetCategory',
      delete: 'deleteAssetCategory',
      data: 'getMainAssetsCategory'
    },
  };
  isEdit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private assetsService: AssetsService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initiation();
    // this.getMainAssets();
    this.loadEntities('AssetsCategories', 1);
  }
  initiation() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      mainAssetId: [],
      isHasMainCategory: [false],
    });
  }

  // getMainAssets(name?:string) {
  //   this.assetsService.getMainAssetsCategory().subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.assets = res.data.list;
  //       this.totalRows = res.data.totalRows;
  //     },
  //     error: (err) => console.log(err),
  //   });
  // }

  loadEntities(entity: string, pageIndex: number, name?: string): void {
    const query: any = {
      companyId: this.companyId,
      pageIndex,
    };
    if (name) {
      query.name = name;
    }

    const methodName = this.entityTypes[entity].load as keyof AssetsService;
    (this.assetsService[methodName] as Function)(query).subscribe((response: any) => {
      if (response.status === 200) {
        (this as any)[this.entityTypes[entity].data] = response.data.list;
        this.pageIndex[entity] = response.data.pageIndex;
        this.totalRows[entity] = response.data.totalRows;
        this.assets = response.data.list;
        // this.totalRows = response.data.totalRows;
      }
    });
  }

  deleteEntity(entity: string, id: number): void {
    const methodName = this.entityTypes[entity].delete as keyof AssetsService;
    (this.assetsService[methodName] as Function)(id, this.companyId).subscribe((response: any) => {
      if (response.status === 200) {
        this.loadEntities(entity, this.pageIndex[entity]);
      }
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
      });
      return;
    }
    if (this.form.controls['isHasMainCategory'].value) {
      this.AssetsData  = {
        companyId: Number(this.localStorageService.getItem('companyId')),
        name: this.form.controls['name'].value,
        nameAr: this.form.controls['nameAr'].value,
        mainAssetId: Number(this.form.controls['mainAssetId'].value),
      };
    }else{
      this.AssetsData  = {
        companyId: Number(this.localStorageService.getItem('companyId')),
        name: this.form.controls['name'].value,
        nameAr: this.form.controls['nameAr'].value
      };
    }

    this.assetsService.addAssetCategory(this.AssetsData).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => console.log(err),
    });
  }
  openAddModal(): void {
    this.isEdit = false;
    this.formData = { isDeduction: true }; 
  }

  openEditModal(item: any): void {
    this.isEdit = true;
    this.formData = { ...item, companyId: this.companyId };
  }

   onTypeChange(): void {
    this.loadEntities('AssetsCategories', 1);
  }
}
