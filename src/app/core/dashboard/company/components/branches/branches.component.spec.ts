import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrunchesComponent } from './branches.component';

describe('BrunchesComponent', () => {
  let component: BrunchesComponent;
  let fixture: ComponentFixture<BrunchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrunchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrunchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
