import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTypeIndexComponent } from './request-type-index.component';

describe('RequestTypeIndexComponent', () => {
  let component: RequestTypeIndexComponent;
  let fixture: ComponentFixture<RequestTypeIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestTypeIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTypeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
