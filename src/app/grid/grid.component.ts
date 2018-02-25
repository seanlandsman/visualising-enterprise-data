import {Component, OnInit} from '@angular/core';
// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise';
import {OlympicRecord} from '../model/OlympicRecord';
import {ColDef} from 'ag-grid';
import {OlympicDataService} from '../services/olympic-data.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  columnDefs: ColDef[];
  rowData: OlympicRecord[];

  constructor(private olympicDataService: OlympicDataService) {
  }

  ngOnInit() {
    this.columnDefs = this.getColumnDefs();
    this.olympicDataService.getOympicData()
      .subscribe(olympicData => this.rowData = olympicData);
  }

  getAutoGrouColumnDef(): any {
    return {
      field: 'athlete',
      width: 180,
      cellRenderer: 'agGroupCellRenderer'
    };
  }

  private getColumnDefs(): ColDef[] {
    return [
      {
        field: 'gold',
        width: 75
      },
      {
        field: 'silver',
        width: 75
      },
      {
        field: 'bronze',
        width: 90
      },
      {
        field: 'total',
        width: 75
      },
      {
        field: 'country',
        width: 100,
        rowGroup: true,
        hide: true
      },
      {
        field: 'year',
        width: 70
      },
      {
        field: 'sport',
        width: 110
      }
    ];
  }
}
