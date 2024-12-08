import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAssetPopupComponent } from './assign-asset-popup.component';

describe('AssignAssetPopupComponent', () => {
  let component: AssignAssetPopupComponent;
  let fixture: ComponentFixture<AssignAssetPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignAssetPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignAssetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
