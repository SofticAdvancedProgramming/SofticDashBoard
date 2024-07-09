import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitlementsCardComponent } from './entitlements-card.component';

describe('EntitlementsCardComponent', () => {
  let component: EntitlementsCardComponent;
  let fixture: ComponentFixture<EntitlementsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitlementsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntitlementsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
