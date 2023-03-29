import { TestBed } from '@angular/core/testing';

import { SentimientosService } from './sentimientos.service';

describe('SentimientosService', () => {
  let service: SentimientosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SentimientosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
