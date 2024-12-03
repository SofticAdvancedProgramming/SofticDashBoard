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

@Component({
  selector: 'app-assets-category',
  standalone: true,
  imports: [
    DropDownComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './assets-category.component.html',
  styleUrl: './assets-category.component.css',
})
export class AssetsCategoryComponent implements OnInit {
  form!: FormGroup;
  assets: any[] = [];
  AssetsData!: Assets;
  lang: string = this.localStorageService.getItem('lang')!;
  constructor(
    private fb: FormBuilder,
    private assetsService: AssetsService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initiation();
    this.getMainAssets();
  }
  initiation() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      mainAssetId: [],
      isHasMainCategory: [false],
    });
  }

  getMainAssets() {
    this.assetsService.getMainAssets().subscribe({
      next: (res) => {
        console.log(res);
        this.assets = res.data.list;
      },
      error: (err) => console.log(err),
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

    this.assetsService.addAsset(this.AssetsData).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => console.log(err),
    });
  }
}
