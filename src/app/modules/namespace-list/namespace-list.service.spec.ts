import { TestBed } from '@angular/core/testing';

import { NamespaceListService } from './namespace-list.service';

describe('NamespaceListService', () => {
  let service: NamespaceListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NamespaceListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
