import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchManagmentComponent } from './branch-managment.component';

describe('BranchManagmentComponent', () => {
  let component: BranchManagmentComponent;
  let fixture: ComponentFixture<BranchManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
