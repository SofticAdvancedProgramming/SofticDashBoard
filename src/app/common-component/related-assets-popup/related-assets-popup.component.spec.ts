import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedAssetsPopupComponent } from './related-assets-popup.component';

describe('RelatedAssetsPopupComponent', () => {
  let component: RelatedAssetsPopupComponent;
  let fixture: ComponentFixture<RelatedAssetsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedAssetsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedAssetsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
