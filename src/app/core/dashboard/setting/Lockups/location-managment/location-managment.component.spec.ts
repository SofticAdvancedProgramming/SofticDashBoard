import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationManagmentComponent } from './location-managment.component';

describe('LocationManagmentComponent', () => {
  let component: LocationManagmentComponent;
  let fixture: ComponentFixture<LocationManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
