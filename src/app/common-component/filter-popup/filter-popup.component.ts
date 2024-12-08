import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsService } from '../../services/AssetsService/assets.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-filter-popup',
  standalone: true,
  imports: [CommonModule , TranslateModule, ReactiveFormsModule, FormsModule],
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.css']
})
export class FilterPopupComponent implements OnInit {

  @Output() closeFilterPopup = new EventEmitter<boolean>();
  @Output() confirmFilterPopup = new EventEmitter<any>();
  assetsCategories: any[] = [];
  form!: FormGroup;
  lang = localStorage.getItem('lang');

  constructor(private assetsService:AssetsService, private fb:FormBuilder){}
  ngOnInit(): void {
    this.getAssetsCategory();
    this.initiation();
  }
  closePopup() {
    this.closeFilterPopup.emit(false);
  }
  initiation(){
    this.form = this.fb.group({
      name: [],
      AssetCategory: [],
      isAssigned: [],
      isDrived: []
    })
  }

  applyFilters() {
    const result = { 
      AssetCategory: this.form.controls['AssetCategory'].value,
      name : this.form.controls['name'].value,
      isAssigned : this.form.controls['isAssigned'].value,
      isDrived: this.form.controls['isDrived'].value,
     }
    this.confirmFilterPopup.emit(result)
    this.closePopup();
  }
  getAssetsCategory(){
    this.assetsService.getMainAssetsCategory().subscribe({
      next: (res) => {
        console.log(res);
        this.assetsCategories = res.data.list;
      },
      error: err => console.log(err)
    })
  }


}
