import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewarkDialogComponent } from './rewark-dialog.component';

describe('RewarkDialogComponent', () => {
  let component: RewarkDialogComponent;
  let fixture: ComponentFixture<RewarkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewarkDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewarkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
