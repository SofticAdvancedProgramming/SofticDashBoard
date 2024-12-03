import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAssetsComponent } from './show-assets.component';

describe('ShowAssetsComponent', () => {
  let component: ShowAssetsComponent;
  let fixture: ComponentFixture<ShowAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
