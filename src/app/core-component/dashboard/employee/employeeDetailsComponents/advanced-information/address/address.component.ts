import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { LocalStorageService } from '../../../../../../services/local-storage-service/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { UserAddressService } from '../../../../../../services/userAddressService/user-address.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
})
export class AddressComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  id: number = 0;
  userAddress: any;
  requestTypes: any;
  currentLang: string = 'en';
  city: any;

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
        console.log(this.id);
        this.getAddresses();
      });
  }

  getAddresses() {
    this.userAddressService
      .getAddress({ userId: this.id })
      .pipe(
        tap((res) => {
          this.userAddress = res.data.list[0];
          console.log(res);
          this.getCountry(this.userAddress.countryId);
          this.getCity(this.userAddress.cityId);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }
  getCountry(countryId: number) {
    const requestPayload = { countryId };
    this.userAddressService
      .getCountry(requestPayload)
      .pipe(
        tap((response: any) => {
          this.requestTypes = response.data.list[0];
          // .map((type: any) => ({
          //   id: type.id,
          //   name: this.currentLang === 'ar' ? type.nameAr : type.name,
          // }));
          console.log(response);
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Error fetching request types:', err);
        },
      });
  }

  getCity(cityId: number) {
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
          console.log(response);
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
