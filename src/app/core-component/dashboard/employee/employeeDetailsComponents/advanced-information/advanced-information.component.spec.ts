import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedInformationComponent } from './advanced-information.component';

describe('AdvancedInformationComponent', () => {
  let component: AdvancedInformationComponent;
  let fixture: ComponentFixture<AdvancedInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
