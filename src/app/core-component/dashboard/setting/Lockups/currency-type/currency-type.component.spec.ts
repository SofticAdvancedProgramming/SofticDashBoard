import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyTypeComponent } from './currency-type.component';

describe('CurrencyTypeComponent', () => {
  let component: CurrencyTypeComponent;
  let fixture: ComponentFixture<CurrencyTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
