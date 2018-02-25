import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
// import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatCardModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// ag-grid
import {AgGridModule} from 'ag-grid-angular';

import {AppComponent} from './app.component';
import {GridComponent} from './grid/grid.component';
import {OlympicDataService} from './services/olympic-data.service';


@NgModule({
  declarations: [
    AppComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatCardModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([])
  ],
  providers: [OlympicDataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
