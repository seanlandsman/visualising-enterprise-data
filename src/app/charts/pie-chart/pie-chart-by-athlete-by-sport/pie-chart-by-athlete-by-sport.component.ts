import {Component, ElementRef, OnInit} from '@angular/core';
import * as D3 from 'D3/index';
import {BaseD3ChartComponent} from '../../base-d3-chart.component';
import {Subscription} from 'rxjs/Subscription';
import {SummarisedOlympicRecord} from '../../../model/SummarisedOlympicRecord';
import {ChartDataService} from '../../../services/chart-data.service';

@Component({
  selector: 'app-pie-chart-by-athlete-by-sport',
  template: ''   // no template - D3 will do it for us
})
export class PieChartByAthleteBySportComponent extends BaseD3ChartComponent implements OnInit {
  private summarisedOlympicRecords: SummarisedOlympicRecord[] = [];

  private chartDataChangedSubscription: Subscription;

  constructor(element: ElementRef,
              private chartDataService: ChartDataService) {
    super(element);

    this.colourScale = D3.scaleOrdinal().range(['#965A38', '#A8A8A8', '#D9A441']);
  }

  ngOnInit() {
    this.initialiseSizeAndScale();
    this.buildSVG();

    this.chartDataChangedSubscription = this.chartDataService.chartDataChanged
      .subscribe((summarisedOlympicRecords => {
        this.summarisedOlympicRecords = summarisedOlympicRecords;
        this.render();
      }));
  }

  render() {
    this.svg.selectAll('*').remove();
    if (this.summarisedOlympicRecords && this.summarisedOlympicRecords.length > 0) {
      const svgWidth = +this.svg.attr('width');
      const svgHeight = +this.svg.attr('height');

      const radius = Math.min(svgWidth, svgHeight) / 2;
      const pieGroup = this.svg.append('g')
        .attr('transform', 'translate(' + svgWidth / 2 + ',' + svgHeight / 2 + ')');

      this.colourScale = D3.scaleOrdinal(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

      const pie = D3.pie()
        .sort(null)
        .value((summarisedOlympicRecord: any) => (<SummarisedOlympicRecord>summarisedOlympicRecord).total);

      const path = D3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

      const label = D3.arc()
        .outerRadius(radius - 20)
        .innerRadius(radius - 40);

      const arc = pieGroup.selectAll('.arc')
        .data(pie(<any>this.summarisedOlympicRecords))
        .enter().append('g')
        .attr('class', 'arc');

      arc.append('path')
        .attr('d', path)
        .attr('fill', (d) => this.colourScale(d.data.country));

      arc.append('text')
        .attr('transform', (d) => {
          return 'translate(' + label.centroid(d) + ')';
        })
        .attr('dy', '0.35em')
        .attr('dx',  (data) => {
          if (data.index === 0) {
            return '-7em';
          }
          return '0';
        })
        .text((d) => {
          return d.data.country;
        });
    }
  }
}
