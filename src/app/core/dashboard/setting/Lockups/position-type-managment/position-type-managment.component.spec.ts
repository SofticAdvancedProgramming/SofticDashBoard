import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionTypeManagmentComponent } from './position-type-managment.component';

describe('PositionTypeManagmentComponent', () => {
  let component: PositionTypeManagmentComponent;
  let fixture: ComponentFixture<PositionTypeManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionTypeManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionTypeManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
