import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedAssetsComponent } from './related-assets.component';

describe('RelatedAssetsComponent', () => {
  let component: RelatedAssetsComponent;
  let fixture: ComponentFixture<RelatedAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedAssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
