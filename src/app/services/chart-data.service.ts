import {EventEmitter, Injectable} from '@angular/core';
import {SummarisedOlympicRecord} from '../model/SummarisedOlympicRecord';

@Injectable()
export class ChartDataService {
  chartDataChanged = new EventEmitter<SummarisedOlympicRecord[]>();

  private summarisedOlympicRecords: SummarisedOlympicRecord[] = [];

  setChartData(summarisedOlympicRecords: SummarisedOlympicRecord[]) {
    this.summarisedOlympicRecords = summarisedOlympicRecords;
    this.chartDataChanged.emit(this.summarisedOlympicRecords.slice());
  }
}
