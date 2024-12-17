import { Component, OnInit } from '@angular/core';
import { DropDownComponent } from '../../../../components/drop-down/drop-down.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModernTableComponent } from '../../../../components/modern-table/modern-table.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DynamicFormComponent } from '../../../../../../common-component/form/dynamic-form/dynamic-form.component';
import { DynamicModalComponent } from '../../../../components/dynamic-modal/dynamic-modal.component';
import { Assets } from '../../../../../../../models/assetsModel';
import { AssetsService } from '../../../../../../services/AssetsService/assets.service';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';

@Component({
  selector: 'app-related-assets',
  standalone: true,
  imports: [
    DropDownComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ModernTableComponent,
    PaginationModule,
    DynamicFormComponent,
    DynamicModalComponent
  ],
  templateUrl: './related-assets.component.html',
  styleUrl: './related-assets.component.css'
})
export class RelatedAssetsComponent implements OnInit{
  form!: FormGroup;
  formData: any = {};
  assets: any[] = [];
  relatedAssets: any[] = [];
  RelatedAssetsData: any;
  lang: string = this.localStorageService.getItem('lang')!;
  totalRows: any = { RelatedAssets: 0 };
  currentPage: number = 1;
  itemsPerPage: number = 10;
  modalId = 'RelatedAssets';
  deleteId: string = 'deleteAssetCategory';
  columns: string[] = ['name' , 'nameAr','parentAssetName','parentAssetNameAr']
  companyId = this.localStorageService.getItem('companyId');
  pageIndex: any = {};
  entityTypes: Record<
    string,
    { load: string; add: string; edit: string; delete: string; data: string }
  > = {
    RelatedAssets: {
      //load: 'getRelatedAssets',
      load:'getAsset',
      add: 'addRelatedAssets',
      edit: 'editRelatedAssets',
      delete: 'deleteRelatedAssets',
      data: 'getMainAssetsCategory'
    },
  };
  isEdit: boolean = false;
  structure = [
    { name: 'name', label: 'Name In Arabic', type: 'text', required: true },
    { name: 'nameAr', label: 'Name In English', type: 'text', required: true },
    { name: 'model', label: 'Model', type: 'text', required: true },
    { name: 'mainAssetId', label: 'Asset', type: 'text', required: true },
  ];
  constructor(
    private fb: FormBuilder,
    private assetsService: AssetsService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initiation();
    // this.getMainAssets();
    this.loadEntities('RelatedAssets', 1);
    this.loadAssets();
  }
  initiation() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      model: ['' , Validators.required],
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
  getParentAsset(id:number){
    const params={id}
    this.assetsService.getAsset(params).subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }
  loadAssets(){
    const params={"isMain": false}
    this.assetsService.getAsset(params)
    .subscribe({
      next: (res) => {
        this.assets = res.data.list
        this.relatedAssets= res.data.list
        console.log(res.data.list)
        console.log(this.relatedAssets)

        // this.relatedAssets=  this.relatedAssets.map((item:any)=>{
        //   this.getParentAsset(item.parentAssetId)
        // }
        // )


      },
      error: (err)=>{
        console.log(err)
      }
    })
  }
  loadEntities(entity: string, pageIndex: number, name?: string,isAssgined?:string): void {

    let query: any = {
      companyId: this.companyId,
      isMain: false,
      pageIndex,

    };
    if (name) {
      query.name = name;
      console.log(name)
    }
    if (isAssgined!=undefined) {
      if(isAssgined==='true'){
        query.isAssgined=true
        }else{
          query.isAssgined=false
        }
      }

      console.log(query)

    const methodName = this.entityTypes[entity].load as keyof AssetsService;
    (this.assetsService[methodName] as Function)(query).subscribe((response: any) => {
      if (response.status === 200) {
        (this as any)[this.entityTypes[entity].data] = response.data.list;
        this.pageIndex[entity] = response.data.pageIndex;
        this.totalRows[entity] = response.data.totalRows;
        this.relatedAssets = response.data.list;
        // this.totalRows = response.data.totalRows;
      }
    });
  }

  editEntity(entity: string, updatedEntity: any): void {
    const methodName = this.entityTypes[entity].edit as keyof AssetsService;
    (this.assetsService[methodName] as Function)(updatedEntity).subscribe((response: any) => {
      if (response.status === 200) {
        this.loadEntities(entity, this.pageIndex[entity]);
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
      this.RelatedAssetsData  = {
        companyId: Number(this.localStorageService.getItem('companyId')),
        name: this.form.controls['name'].value,
        nameAr: this.form.controls['nameAr'].value,
        model: this.form.controls['model'].value,
        assetId: Number(this.form.controls['mainAssetId'].value),
      };
    }else{
      this.RelatedAssetsData  = {
        companyId: Number(this.localStorageService.getItem('companyId')),
        name: this.form.controls['name'].value,
        nameAr: this.form.controls['nameAr'].value
      };
    }

    this.assetsService.addRelatedAsset(this.RelatedAssetsData).subscribe({
      next: (res) => {
        console.log(res);
        this.ngOnInit();
      },
      error: (err) => console.log(err),
    });
  }
  openAddModal(): void {
    this.isEdit = false;
  }

  openEditModal(item: any): void {
    this.isEdit = true;
    this.formData = { ...item, companyId: this.companyId };
  }

   onTypeChange(): void {
    this.loadEntities('RelatedAssets', 1);
  }

  handleFormSubmission(data: any): void {
    data.companyId = this.companyId;
    if (this.isEdit) {
      data.id = this.formData.id;
      this.editEntity('RelatedAssets', data);
    }
  }
}
