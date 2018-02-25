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
      width: 200,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        footerValueGetter: '"Total (" + x + ")"',
        padding: 5
      }
    };
  }

  private getColumnDefs(): ColDef[] {
    return [
      {
        field: 'gold',
        width: 100,
        aggFunc: 'sum',
        enableValue: true,
        allowedAggFuncs: ['sum', 'min', 'max']
      },
      {
        field: 'silver',
        width: 100,
        aggFunc: 'min',
        enableValue: true
      },
      {
        field: 'bronze',
        width: 100,
        aggFunc: 'max',
        enableValue: true
      },
      {
        field: 'total',
        width: 100,
        aggFunc: 'avg',
        enableValue: true
      },
      {
        field: 'age',
        width: 90
      },
      {
        field: 'country',
        width: 120,
        rowGroup: true
      },
      {
        field: 'year',
        width: 90
      },
      {
        field: 'date',
        width: 110
      },
      {
        field: 'sport',
        width: 110
      }
    ];
  }
}
