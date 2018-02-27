import {Component, ElementRef, OnInit} from '@angular/core';
import {BaseD3ChartComponent} from '../../base-d3-chart.component';

@Component({
  selector: 'app-stacked-bar-chart-by-country-athlete',
  templateUrl: './stacked-bar-chart-by-country-athlete.component.html',
  styleUrls: ['./stacked-bar-chart-by-country-athlete.component.css']
})
export class StackedBarChartByCountryAthleteComponent extends BaseD3ChartComponent implements OnInit {

  constructor(element: ElementRef) {
    super(element);
  }

  ngOnInit() {
  }
}
