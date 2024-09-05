import { Component } from '@angular/core';
import { CountdownComponent } from "../../../../../common-component/countdown/countdown.component";

@Component({
    selector: 'app-top-managment',
    standalone: true,
    templateUrl: './top-managment.component.html',
    styleUrl: './top-managment.component.css',
    imports: [CountdownComponent]
})
export class TopManagmentComponent {

}
