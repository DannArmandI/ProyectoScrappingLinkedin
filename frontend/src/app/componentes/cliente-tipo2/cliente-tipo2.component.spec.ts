import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteTipo2Component } from './cliente-tipo2.component';

describe('ClienteTipo2Component', () => {
  let component: ClienteTipo2Component;
  let fixture: ComponentFixture<ClienteTipo2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteTipo2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteTipo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
