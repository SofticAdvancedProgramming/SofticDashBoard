import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsTypeManagementComponent } from './skills-type-management.component';

describe('SkillsTypeManagementComponent', () => {
  let component: SkillsTypeManagementComponent;
  let fixture: ComponentFixture<SkillsTypeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsTypeManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
