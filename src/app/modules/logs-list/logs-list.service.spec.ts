import { TestBed } from '@angular/core/testing';

import { LogsListService } from './logs-list.service';

describe('LogsListService', () => {
  let service: LogsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
