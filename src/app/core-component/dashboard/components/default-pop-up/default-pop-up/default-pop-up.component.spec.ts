import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPopUpComponent } from './default-pop-up.component';

describe('DefaultPopUpComponent', () => {
  let component: DefaultPopUpComponent;
  let fixture: ComponentFixture<DefaultPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
