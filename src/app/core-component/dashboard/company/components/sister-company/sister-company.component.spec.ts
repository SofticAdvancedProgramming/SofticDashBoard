import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SisterCompanyComponent } from './sister-company.component';

describe('SisterCompanyComponent', () => {
  let component: SisterCompanyComponent;
  let fixture: ComponentFixture<SisterCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SisterCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SisterCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
