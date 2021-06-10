import { TestBed } from '@angular/core/testing';

import { PodListService } from './pod-list.service';

describe('PodListService', () => {
  let service: PodListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PodListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
