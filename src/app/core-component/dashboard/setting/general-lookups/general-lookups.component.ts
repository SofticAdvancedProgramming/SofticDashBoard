import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NextButtonComponent } from '../components/next-button/next-button.component';
import { LockupCardComponent } from "../../../../common-component/lockup-card/lockup-card.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-general-lookups',
    standalone: true,
    templateUrl: './general-lookups.component.html',
    styleUrl: './general-lookups.component.css',
    imports: [RouterLink, NextButtonComponent, LockupCardComponent , CommonModule]
})
export class GeneralLookupsComponent {
    role: any = JSON.parse(localStorage.getItem('roles')!);
}
