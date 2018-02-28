import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {timer} from 'rxjs/observable/timer';
import {debounce} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise';

import {OlympicRecord} from '../model/OlympicRecord';
import {ColDef, ColumnApi, GridApi, GridReadyEvent, RowNode} from 'ag-grid';
import {OlympicDataService} from '../services/olympic-data.service';
import {ChartDataService} from '../services/chart-data.service';
import {SummarisedOlympicRecord} from '../model/SummarisedOlympicRecord';
import {BarChartByTotalMedalsComponent} from '../charts/bar-chart/bar-chart-by-total-medals/bar-chart-by-total-medals.component';
import {StackedBarChartByCountryAthleteComponent} from '../charts/bar-chart/stacked-bar-chart-by-country-athlete/stacked-bar-chart-by-country-athlete.component';

const rowNodeTotalSumReducer = (accumulator, currentValue: RowNode) => accumulator + currentValue.data.total;

const sortByMedalsWonComparator = (nodeA: RowNode, nodeB: RowNode) => {
  if (nodeA.group && nodeB.group) {
    const sumTotalA = nodeA.childrenAfterGroup.reduce(rowNodeTotalSumReducer, 0);
    const sumTotalB = nodeB.childrenAfterGroup.reduce(rowNodeTotalSumReducer, 0);

    return sumTotalA - sumTotalB;
  } else if (nodeA.group && !nodeB.group) {
    return 1;
  } else if (nodeB.group && !nodeA.group) {
    return -1;
  }

  return nodeA.data.total - nodeB.data.total;
};

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  @Output() chartChanged = new EventEmitter<any>();

  private api: GridApi;
  private columnApi: ColumnApi;

  columnDefs: ColDef[];
  rowData: OlympicRecord[];

  selectionEventSubject = new Subject<RowNode[]>();
  selectEventsObserver: Observable<RowNode[]>;

  constructor(private olympicDataService: OlympicDataService,
              private chartDataService: ChartDataService) {
  }

  ngOnInit() {
    this.columnDefs = this.getColumnDefs();
    this.olympicDataService.getOympicData()
      .subscribe(olympicData => this.rowData = olympicData);

    // debounce the row selection events - only pass the selected rows after 20ms
    this.selectEventsObserver = this.selectionEventSubject.pipe(debounce(() => timer(20)));
    this.selectEventsObserver.subscribe(rowNodes => {
        const summarisedOlympicRecords: SummarisedOlympicRecord[] = rowNodes.map((groupedRowNode) => {
          const country = groupedRowNode.key;
          const total = groupedRowNode.childrenAfterGroup.reduce(rowNodeTotalSumReducer, 0);
          const olympicRecords = groupedRowNode.childrenAfterGroup.map((rowNode) => rowNode.data);
          return new SummarisedOlympicRecord(country,
            total,
            olympicRecords);
        });
        this.chartDataService.setChartData(summarisedOlympicRecords);
      }
    );
  }

  getAutoGroupColumnDef(): any {
    return {
      field: 'athlete',
      colId: 'autoGroupId',
      width: 180,
      cellRenderer: 'agGroupCellRenderer',
      comparator: (valueA, valueB, nodeA: RowNode, nodeB: RowNode) => {
        return sortByMedalsWonComparator(nodeA, nodeB);
      }
    };
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  selectionChanged() {
    this.selectionEventSubject.next(this.api.getSelectedNodes());
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

  selectTopTenCountries() {
    this.sortByGroupedColumn();
    this.selectTopTenGroupedRowsByTotalMedalsWon();

    this.chartChanged.emit(BarChartByTotalMedalsComponent);
  }

  selectTopTenByCountriesAthlete() {
    this.sortByGroupedColumn();
    this.selectTopTenGroupedRowsByTotalMedalsWon();

    this.chartChanged.emit(StackedBarChartByCountryAthleteComponent);
  }

  private selectTopTenGroupedRowsByTotalMedalsWon() {
    const groupedNodes: RowNode[] = [];
    this.api.forEachNode((node) => {
      if (node.group) {
        groupedNodes.push(node);
      }
    });

    groupedNodes.sort(<any>sortByMedalsWonComparator).reverse()
      .slice(0, 10)
      .forEach((rowNode: RowNode) => rowNode.setSelected(true));
  }

  private sortByGroupedColumn() {
    const sort = [
      {colId: 'ag-Grid-AutoColumn', sort: 'desc'}
    ];
    this.api.setSortModel(sort);
  }
}
