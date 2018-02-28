import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {MatCardModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// ag-grid
import {AgGridModule} from 'ag-grid-angular';
// our app
import {AppComponent} from './app.component';
import {GridComponent} from './grid/grid.component';
import {ChartDataService} from './services/chart-data.service';
import {OlympicDataService} from './services/olympic-data.service';
import {BarChartByTotalMedalsComponent} from './charts/bar-chart/bar-chart-by-total-medals/bar-chart-by-total-medals.component';
import {StackedBarChartByCountryAthleteComponent} from './charts/bar-chart/stacked-bar-chart-by-country-athlete/stacked-bar-chart-by-country-athlete.component';
import {ChartManagerComponent} from './charts/chart-manager/chart-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ChartManagerComponent,
    BarChartByTotalMedalsComponent,
    StackedBarChartByCountryAthleteComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatCardModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([])
  ],
  providers: [OlympicDataService, ChartDataService],
  bootstrap: [AppComponent],
  entryComponents: [BarChartByTotalMedalsComponent, StackedBarChartByCountryAthleteComponent]
})
export class AppModule {
}
