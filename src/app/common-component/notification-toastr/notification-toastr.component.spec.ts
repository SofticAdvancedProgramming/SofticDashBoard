import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationToastrComponent } from './notification-toastr.component';

describe('NotificationToastrComponent', () => {
  let component: NotificationToastrComponent;
  let fixture: ComponentFixture<NotificationToastrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationToastrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationToastrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
