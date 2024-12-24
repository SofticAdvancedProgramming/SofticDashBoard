import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTypeDetailsComponent } from './request-type-details.component';

describe('RequestTypeDetailsComponent', () => {
  let component: RequestTypeDetailsComponent;
  let fixture: ComponentFixture<RequestTypeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestTypeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
