import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContractComponent } from './user-contract.component';

describe('UserContractComponent', () => {
  let component: UserContractComponent;
  let fixture: ComponentFixture<UserContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserContractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
