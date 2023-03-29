import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementosDescargasComponent } from './elementos-descargas.component';

describe('ElementosDescargasComponent', () => {
  let component: ElementosDescargasComponent;
  let fixture: ComponentFixture<ElementosDescargasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementosDescargasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementosDescargasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
