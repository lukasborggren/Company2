import { TestBed } from '@angular/core/testing';

import { NewsScoreCalculatorService } from './news-score-calculator.service';

describe('NewsScoreCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewsScoreCalculatorService = TestBed.get(NewsScoreCalculatorService);
    expect(service).toBeTruthy();
  });
});
