import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAttachmentsComponent } from './user-attachments.component';

describe('UserAttachmentsComponent', () => {
  let component: UserAttachmentsComponent;
  let fixture: ComponentFixture<UserAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAttachmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
