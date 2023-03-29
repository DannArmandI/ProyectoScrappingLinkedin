import { TestBed } from '@angular/core/testing';

import { VigilanteChildGuard } from './vigilante-child.guard';

describe('VigilanteChildGuard', () => {
  let guard: VigilanteChildGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VigilanteChildGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
