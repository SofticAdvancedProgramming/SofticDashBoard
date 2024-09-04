import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockupCardComponent } from './lockup-card.component';

describe('LockupCardComponent', () => {
  let component: LockupCardComponent;
  let fixture: ComponentFixture<LockupCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LockupCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockupCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
