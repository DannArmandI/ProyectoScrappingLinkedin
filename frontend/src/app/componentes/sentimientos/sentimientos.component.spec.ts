import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimientosComponent } from './sentimientos.component';

describe('SentimientosComponent', () => {
  let component: SentimientosComponent;
  let fixture: ComponentFixture<SentimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentimientosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SentimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
