import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UncompletedCompaniesComponent } from './uncompleted-companies.component';

describe('UncompletedCompaniesComponent', () => {
  let component: UncompletedCompaniesComponent;
  let fixture: ComponentFixture<UncompletedCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncompletedCompaniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UncompletedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
