import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyCardComponent } from '../components/company-card/company-card.component';

interface Company {
  title: string;
  branches: number;
  cities: number;
  description: string;
  iconSrc: string;
  link: string;
}

@Component({
  selector: 'app-companies',
  standalone: true,
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
  imports: [CommonModule, CompanyCardComponent]
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [
    {
      title: 'IObit',
      branches: 50,
      cities: 2,
      description: '2 cities',
      iconSrc: '../../../../assets/images/softic/Avatar.png',
      link: 'http://iobit.com',
    },
    {
      title: 'S&S Software',
      branches: 150,
      cities: 0,
      description: 'Description',
      iconSrc: '../../../../assets/images/softic/Avatar.png',
      link: 'http://sssoftware.com',
    },
    {
      title: 'D Development',
      branches: 0,
      cities: 0,
      description: 'Description',
      iconSrc: '../../../../assets/images/softic/Avatar.png',
      link: '',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
