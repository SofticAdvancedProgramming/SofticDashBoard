import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeStyleTypeManagmentComponent } from './life-style-type-managment.component';

describe('LifeStyleTypeManagmentComponent', () => {
  let component: LifeStyleTypeManagmentComponent;
  let fixture: ComponentFixture<LifeStyleTypeManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeStyleTypeManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LifeStyleTypeManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
