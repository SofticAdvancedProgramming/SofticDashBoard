import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainSuggestionDetailsComponent } from './complain-suggestion-details.component';

describe('ComplainSuggestionDetailsComponent', () => {
  let component: ComplainSuggestionDetailsComponent;
  let fixture: ComponentFixture<ComplainSuggestionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplainSuggestionDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplainSuggestionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
