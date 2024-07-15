import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinessManagmentComponent } from './bussiness-managment.component';

describe('BussinessManagmentComponent', () => {
  let component: BussinessManagmentComponent;
  let fixture: ComponentFixture<BussinessManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BussinessManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BussinessManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
