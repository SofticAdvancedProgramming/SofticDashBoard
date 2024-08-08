import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEntityComponent } from './assign-entity.component';

describe('AssignEntityComponent', () => {
  let component: AssignEntityComponent;
  let fixture: ComponentFixture<AssignEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignEntityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
