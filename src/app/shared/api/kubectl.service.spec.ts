import { TestBed } from '@angular/core/testing';

import { KubectlService } from './kubectl.service';

describe('KubectlService', () => {
  let service: KubectlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KubectlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
