import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {OlympicRecord} from '../model/OlympicRecord';

@Injectable()
export class OlympicDataService {
  olympicDataUrl = '/assets/olympicWinners.json';

  constructor(private http: HttpClient) {
  }

  getOympicData() {
    return this.http.get<OlympicRecord[]>(this.olympicDataUrl);
  }
}
