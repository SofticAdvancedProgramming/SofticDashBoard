import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatoionComponent } from './evaluatoion.component';

describe('RewarkEvaluatoionComponent', () => {
  let component: EvaluatoionComponent;
  let fixture: ComponentFixture<EvaluatoionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluatoionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluatoionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
