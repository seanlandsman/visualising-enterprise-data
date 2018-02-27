import {OlympicRecord} from './OlympicRecord';

export class SummarisedOlympicRecord {

  constructor(public country: string,
              public total: number,
              public olympicRecords: OlympicRecord[]) {
  }
}
