import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesActionComponent } from './branches-action.component';

describe('BranchesActionComponent', () => {
  let component: BranchesActionComponent;
  let fixture: ComponentFixture<BranchesActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchesActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchesActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
