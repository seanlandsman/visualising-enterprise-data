import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {timer} from 'rxjs/observable/timer';
import {debounce} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import * as _ from 'underscore';
// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise';

import {OlympicRecord} from '../model/OlympicRecord';
import {ColDef, ColumnApi, GridApi, GridReadyEvent, RowNode} from 'ag-grid';
import {OlympicDataService} from '../services/olympic-data.service';
import {ChartDataService} from '../services/chart-data.service';
import {SummarisedOlympicRecord} from '../model/SummarisedOlympicRecord';
import {BarChartByTotalMedalsComponent} from '../charts/bar-chart/bar-chart-by-total-medals/bar-chart-by-total-medals.component';
import {StackedBarChartByCountryMedalTypeComponent} from '../charts/bar-chart/stacked-bar-chart-by-country-athlete/stacked-bar-chart-by-country-medal-type.component';
import {PieChartByAthleteBySportComponent} from '../charts/pie-chart/pie-chart-by-athlete-by-sport/pie-chart-by-athlete-by-sport.component';

const rowNodeTotalSumReducer = (accumulator, currentValue: RowNode) => accumulator + currentValue.data.total;

const sortByMedalsWonComparator = (nodeA, nodeB, valueA, valueB) => {
  if (nodeA && nodeB) {
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
  } else {
    if (valueA && !valueB) {
      return 1;
    }
    if (!valueA && valueB) {
      return -1;
    }
    return valueA.localeCompare(valueB);
  }
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
      this.setBarChartData(rowNodes);
    });
  }

  private setBarChartData(rowNodes) {
    const summarisedOlympicRecords: SummarisedOlympicRecord[] = rowNodes.map((groupedRowNode) => {
      const country = groupedRowNode.key;
      const total = groupedRowNode.childrenAfterGroup.reduce(rowNodeTotalSumReducer, 0);
      const olympicRecords = groupedRowNode.childrenAfterGroup.map((rowNode) => rowNode.data);
      return new SummarisedOlympicRecord(country,
        total,
        olympicRecords);
    });
    this.chartDataService.setBarChartData(summarisedOlympicRecords);
  }

  getAutoGroupColumnDef(): any {
    return {
      field: 'athlete',
      colId: 'autoGroupId',
      width: 180,
      cellRenderer: 'agGroupCellRenderer',
      comparator: (valueA, valueB, nodeA: RowNode, nodeB: RowNode) => {
        return sortByMedalsWonComparator(nodeA, nodeB, valueA, valueB);
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
        field: 'athlete',
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
    this.clearFilterAndSort();
    this.api.deselectAll();

    this.sortByGroupedColumn();
    this.selectTopTenGroupedRowsByTotalMedalsWon();

    this.chartChanged.emit(BarChartByTotalMedalsComponent);
  }

  selectTopTenByCountriesAthlete() {
    this.clearFilterAndSort();
    this.api.deselectAll();

    this.sortByGroupedColumn();
    this.selectTopTenGroupedRowsByTotalMedalsWon();

    this.chartChanged.emit(StackedBarChartByCountryMedalTypeComponent);
  }

  selectTopTenBySport(sport: string) {
    this.clearFilterAndSort();
    this.api.deselectAll();

    const topTenAthletes = this.getTopTenAthleteForSport(sport);

    // only include the top 10 athletes - filter out the rest
    this.api.setFilterModel({athlete: topTenAthletes});

    this.selectParentNodesForAthletes(topTenAthletes);

    this.chartChanged.emit(PieChartByAthleteBySportComponent);
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


  private selectParentNodesForAthletes(topTenAthletes: any[]) {
    this.api.forEachNode((node) => {
      if (!node.group && topTenAthletes.indexOf(node.data.athlete) !== -1) {
        node.parent.setSelected(true);
      }
    });
  }

  private getTopTenAthleteForSport(sport: string) {
    const topN = 10;

    const leafNodesForSport: RowNode[] = [];
    this.api.forEachNode((node) => {
      if (!node.group && node.data.sport === sport) {
        leafNodesForSport.push(node);
      }
    });

    const totalsByAthlete = leafNodesForSport.reduce(
      (accumulator, node) => {
        accumulator[node.data.athlete] = (accumulator[node.data.athlete] || 0) + node.data.total;
        return accumulator;
      }, {});

    const totalMedalCountDesc = _.uniq(_.values(totalsByAthlete))
      .sort((a: number, b: number) => {
        return a - b;
      })
      .reverse()
      .splice(0, 10);

    const pairs = _.pairs(totalsByAthlete);
    let topTenAthletes = [];
    for (let i = 0; i < totalMedalCountDesc.length; i++) {
      topTenAthletes = topTenAthletes.concat(pairs.filter((pair) => pair[1] === totalMedalCountDesc[i])
        .map((pair) => pair[0]));
    }
    topTenAthletes.splice(topN);
    return topTenAthletes;
  }

  private clearFilterAndSort() {
    this.api.setSortModel(null);
    this.api.setFilterModel(null);
  }
}
