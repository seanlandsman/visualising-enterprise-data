import {Component} from '@angular/core';
import {BarChartByTotalMedalsComponent} from './charts/bar-chart/bar-chart-by-total-medals/bar-chart-by-total-medals.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentChartComponent: any = BarChartByTotalMedalsComponent;

  chartChanged(newChartComponent: any) {
    this.currentChartComponent = newChartComponent;
  }
}
