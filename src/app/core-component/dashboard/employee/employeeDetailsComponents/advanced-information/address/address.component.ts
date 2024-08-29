import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../../../../services/userDataService/user-data.service';
import { Address } from '../../../../../../../models/user';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  address?: Address;
  countryName: string = '';
  cityName: string = '';
  zoneName: string = '';

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.loadAddress();
  }

  loadAddress(): void {
    const requestPayload = {}; // Add necessary payload if required

    this.userDataService.loadAddress(requestPayload).subscribe(
      response => {
        if (response.status === 200 && response.data.list.length > 0) {
          this.address = response.data.list[0];

          // Ensure countryId, cityId, and zoneId are not undefined before calling loadNames
          if (
            this.address?.countryId !== undefined &&
            this.address.cityId !== undefined &&
            this.address.zoneId !== undefined
          ) {
            this.loadNames(this.address.countryId, this.address.cityId, this.address.zoneId);
          }
        } else {
          console.error('Failed to fetch address or no address found.');
        }
      },
      error => {
        console.error('Error fetching address:', error);
      }
    );
  }

  loadNames(countryId: number, cityId: number, zoneId: number): void {
    const countryRequest = { id: countryId };
    const cityRequest = { id: cityId };
    const zoneRequest = { id: zoneId };

    forkJoin({
      country: this.userDataService.loadCountries(countryRequest),
      city: this.userDataService.loadCities(cityRequest),
      zone: this.userDataService.loadZones(zoneRequest)
    }).subscribe(
      ({ country, city, zone }) => {
        if (country.status === 200 && country.data.list.length > 0) {
          this.countryName = country.data.list[0].name;
        } else {
          console.error('Failed to fetch country name or no country found.');
        }

        if (city.status === 200 && city.data.list.length > 0) {
          this.cityName = city.data.list[0].name;
        } else {
          console.error('Failed to fetch city name or no city found.');
        }

        if (zone.status === 200 && zone.data.list.length > 0) {
          this.zoneName = zone.data.list[0].name;
        } else {
          console.error('Failed to fetch zone name or no zone found.');
        }
      },
      error => {
        console.error('Error fetching country, city, or zone:', error);
      }
    );
  }
}
