import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveToArchivePopupComponent } from './move-to-archive-popup.component';

describe('MoveToArchivePopupComponent', () => {
  let component: MoveToArchivePopupComponent;
  let fixture: ComponentFixture<MoveToArchivePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveToArchivePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveToArchivePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
