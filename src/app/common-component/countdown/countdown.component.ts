import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-countdown',
  standalone: true,
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit, OnDestroy {
  targetDate!: Date;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  private intervalId: any;

  ngOnInit() {
     const currentDate = new Date();
    this.targetDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    this.calculateTime();
    this.intervalId = setInterval(() => {
      this.calculateTime();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  private calculateTime() {
    const currentDate = new Date().getTime();
    const targetDate = this.targetDate.getTime();
    const timeDifference = targetDate - currentDate;

    if (timeDifference <= 0) {
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      clearInterval(this.intervalId); 
    } else {
      this.days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    }
  }
}
