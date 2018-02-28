import {Injectable} from '@angular/core';
import {SummarisedOlympicRecord} from '../model/SummarisedOlympicRecord';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class ChartDataService {
  chartDataChanged = new BehaviorSubject<SummarisedOlympicRecord[]>([]);

  setChartData(summarisedOlympicRecords: SummarisedOlympicRecord[]) {
    this.chartDataChanged.next(summarisedOlympicRecords.slice());
  }
}
