import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NextButtonComponent } from '../components/next-button/next-button.component';

@Component({
  selector: 'app-general-lookups',
  standalone: true,
  imports: [RouterLink,NextButtonComponent],
  templateUrl: './general-lookups.component.html',
  styleUrl: './general-lookups.component.css'
})
export class GeneralLookupsComponent {

}
