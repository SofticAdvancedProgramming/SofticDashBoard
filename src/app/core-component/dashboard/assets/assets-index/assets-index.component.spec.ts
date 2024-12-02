import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsIndexComponent } from './assets-index.component';

describe('AssetsIndexComponent', () => {
  let component: AssetsIndexComponent;
  let fixture: ComponentFixture<AssetsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
