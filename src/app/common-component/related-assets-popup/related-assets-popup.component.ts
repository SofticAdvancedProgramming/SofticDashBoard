import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { employee } from '../../../models/employee';
import { EmployeeService } from '../../services/employeeService/employee.service';
import { AssetsService } from '../../services/AssetsService/assets.service';
import { DropDownComponent } from "../../core-component/dashboard/components/drop-down/drop-down.component";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RelatedAsset } from '../../../models/assets';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-related-assets-popup',
    standalone: true,
    templateUrl: './related-assets-popup.component.html',
    styleUrl: './related-assets-popup.component.css',
    imports: [DropDownComponent, CommonModule, FormsModule]
})
export class RelatedAssetsPopupComponent {
    relatedAsset: RelatedAsset = {
        companyId: 0,
        name: '',
        nameAr: '',
        model: '',
        assetId: 0,
    };

    @Input() assetId: number = 0;
    @Output() closeRelatedAssets = new EventEmitter<boolean>();

    constructor(
        private assetService: AssetsService,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { }
    ngOnInit() {
        const assetIdFromRoute = Number(this.route.snapshot.paramMap.get('id'));
        this.assetId = assetIdFromRoute;
        this.relatedAsset.assetId = this.assetId;
        console.log('Asset ID:', this.assetId);

        const companyIdFromStorage = localStorage.getItem('companyId');
        if (companyIdFromStorage) {
            this.relatedAsset.companyId = Number(companyIdFromStorage);
        } else {
            console.error('Company ID not found in localStorage');
        }
    }

    closePopup() {
        this.closeRelatedAssets.emit(false);
    }
    Submit() {
        if (this.relatedAsset.name && this.relatedAsset.nameAr && this.relatedAsset.model) {
            this.assetService.addRelatedAsset(this.relatedAsset).subscribe({
                next: (response) => {
                    console.log('Related asset added:', response);

                    this.toastr.success('Related asset added successfully');

                    this.closePopup();
                },

            });
        } else {
            this.toastr.error('All fields are required!');
        }
    }
}