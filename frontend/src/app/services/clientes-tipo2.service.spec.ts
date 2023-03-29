import { TestBed } from '@angular/core/testing';

import { ClientesTipo2Service } from './clientes-tipo2.service';

describe('ClientesTipo2Service', () => {
  let service: ClientesTipo2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientesTipo2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
