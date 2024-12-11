import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangStatusAssetsPopupComponent } from './chang-status-assets-popup.component';

describe('ChangStatusAssetsPopupComponent', () => {
  let component: ChangStatusAssetsPopupComponent;
  let fixture: ComponentFixture<ChangStatusAssetsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangStatusAssetsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangStatusAssetsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
