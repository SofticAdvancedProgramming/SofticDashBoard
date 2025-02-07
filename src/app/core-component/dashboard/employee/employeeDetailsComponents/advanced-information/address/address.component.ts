import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { UserAddressService } from '../../../../../../services/userAddressService/user-address.service';
import { Address, CityName, ContryName } from '../../../../../../../models/advancedIfomation';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [TranslateModule,CommonModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
})
export class AddressComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  id: number = 0;
  userAddress?: Address[]=[];
  ContryName?: ContryName;
  currentLang: string = 'en';
  city?: CityName;
  zone?: any;
  constructor(
    private userAddressService: UserAddressService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.id = Number(params.get('id'));
     
        this.getAddresses();
      });
  }

  getAddresses() {
    this.userAddressService
      .getAddress({ userId: this.id })
      .pipe(
        tap((res) => {
       

          this.userAddress = res.data.list.map((item:Address)=>({
            ...item,

          }
          // this.getCountry(this.userAddress?.countryId);
          // this.getCity(this.userAddress?.cityId);
        ))}),
        takeUntil(this.unsubscribe$))
      .subscribe(
        // {
        //   next:(res)=>
        //     {
        //       this.userAddress=res.data.list[0];
        //       if(res.data.list.length>1){
        //       this.userAddress?.push(res.data.list[res.data.totalRows-1])
        //     }}
        // }
      );
  }
  getCountry(countryId?: number) {
    const requestPayload = { countryId };
    this.userAddressService
      .getCountry(requestPayload)
      .pipe(
        tap((response: any) => {
          this.ContryName = response.data.list[0];
          // .map((type: any) => ({
          //   id: type.id,
          //   name: this.currentLang === 'ar' ? type.nameAr : type.name,
          // }));
        
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Error fetching request types:', err);
        },
      });
  }

  getCity(cityId?: number) {
    const requestPayload = { cityId };
    this.userAddressService
      .getCity(requestPayload)
      .pipe(
        tap((response: any) => {
          this.city = response.data.list[0];
          // .map((type: any) => ({
          //   id: type.id,
          //   name: this.currentLang === 'ar' ? type.nameAr : type.name,
          // }));
    
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Error fetching request types:', err);
        },
      });
  }
  getZone(zoneId?: number) {
    const requestPayload = { zoneId };
    this.userAddressService
      .getZone(requestPayload)
      .pipe(
        tap((response: any) => {
          this.zone = response.data.list[0];
          // .map((type: any) => ({
          //   id: type.id,
          //   name: this.currentLang === 'ar' ? type.nameAr : type.name,
          // }));
        
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Error fetching request types:', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
