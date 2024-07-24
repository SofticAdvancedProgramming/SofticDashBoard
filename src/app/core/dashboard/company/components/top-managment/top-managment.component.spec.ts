import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopManagmentComponent } from './top-managment.component';

describe('TopManagmentComponent', () => {
  let component: TopManagmentComponent;
  let fixture: ComponentFixture<TopManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
