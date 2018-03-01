import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {MatCardModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// ag-grid
import {AgGridModule} from 'ag-grid-angular';
// our app
import {AppComponent} from './app.component';
import {GridComponent} from './grid/grid.component';
import {ChartDataService} from './services/chart-data.service';
import {OlympicDataService} from './services/olympic-data.service';
import {BarChartByTotalMedalsComponent} from './charts/bar-chart/bar-chart-by-total-medals/bar-chart-by-total-medals.component';
import {StackedBarChartByCountryMedalTypeComponent} from './charts/bar-chart/stacked-bar-chart-by-country-athlete/stacked-bar-chart-by-country-medal-type.component';
import {ChartManagerComponent} from './charts/chart-manager/chart-manager.component';
import {PieChartByAthleteBySportComponent} from './charts/pie-chart/pie-chart-by-athlete-by-sport/pie-chart-by-athlete-by-sport.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ChartManagerComponent,
    BarChartByTotalMedalsComponent,
    StackedBarChartByCountryMedalTypeComponent,
    PieChartByAthleteBySportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([])
  ],
  providers: [OlympicDataService, ChartDataService],
  bootstrap: [AppComponent],
  entryComponents: [BarChartByTotalMedalsComponent,
    StackedBarChartByCountryMedalTypeComponent,
    PieChartByAthleteBySportComponent
  ]
})
export class AppModule {
}
