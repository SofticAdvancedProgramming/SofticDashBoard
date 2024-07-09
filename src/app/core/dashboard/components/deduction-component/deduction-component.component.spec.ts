import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionComponentComponent } from './deduction-component.component';

describe('DeductionComponentComponent', () => {
  let component: DeductionComponentComponent;
  let fixture: ComponentFixture<DeductionComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeductionComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
