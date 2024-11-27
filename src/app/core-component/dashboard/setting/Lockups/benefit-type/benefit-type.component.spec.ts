import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitTypeComponent } from './benefit-type.component';

describe('BenefitTypeComponent', () => {
  let component: BenefitTypeComponent;
  let fixture: ComponentFixture<BenefitTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenefitTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenefitTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
