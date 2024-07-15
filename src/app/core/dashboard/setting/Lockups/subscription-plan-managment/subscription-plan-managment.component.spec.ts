import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlanManagmentComponent } from './subscription-plan-managment.component';

describe('SubscriptionPlanManagmentComponent', () => {
  let component: SubscriptionPlanManagmentComponent;
  let fixture: ComponentFixture<SubscriptionPlanManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionPlanManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionPlanManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
