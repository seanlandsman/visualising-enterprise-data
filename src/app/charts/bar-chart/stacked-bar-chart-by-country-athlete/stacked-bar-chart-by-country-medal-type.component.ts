import {Component, ElementRef, OnInit} from '@angular/core';
import * as D3 from 'D3/index';
import {BaseD3ChartComponent} from '../../base-d3-chart.component';
import {Subscription} from 'rxjs/Subscription';
import {SummarisedOlympicRecord} from '../../../model/SummarisedOlympicRecord';
import {ChartDataService} from '../../../services/chart-data.service';

@Component({
  selector: 'app-stacked-bar-chart-by-country-athlete',
  template: ''   // no template - D3 will do it for us
})
export class StackedBarChartByCountryMedalTypeComponent extends BaseD3ChartComponent implements OnInit {
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
      // create the xScale based on countries
      const xScale = D3.scaleBand()
        .domain(this.summarisedOlympicRecords.map((summarisedOlympicRecord: SummarisedOlympicRecord) => {
          return summarisedOlympicRecord.country;
        }))
        .range([0, this.width])
        .paddingInner(0.1); // a bit of padding between the bars

      // create the yScale based on total medals won by country
      const yScale = D3.scaleLinear()
        .domain([0, D3.max(this.summarisedOlympicRecords, (summarisedOlympicRecord: SummarisedOlympicRecord) => {
          return summarisedOlympicRecord.total;
        })])
        .range([this.height, 0]);

      const keys = ['bronze', 'silver', 'gold'];

      this.svg.append('g')
        .selectAll('g')
        // d3 will pull out the values in this.summarisedOlympicRecords as specified by keys (gold, silver and bronze)
        .data(D3.stack().keys(keys)(<any>this.summarisedOlympicRecords))
        .enter()
        .append('g')
        .attr('fill', (d, i) => {
          // for each segment (in turn)
          // d is an object with:
          //    0-number of items : {
          //        0: ?,
          //        1: value for current index (ie value for bronze, silver or gold, for the current country),
          //        data: SummarisedOlympicRecord for the current country
          //    },
          //    index: index of this data item
          //    key: current key

          // pick the colour based on our colour scale
          return this.colourScale(d.key);
        })
        .selectAll('rect')
        .data((d) => {
          //  {
          //      0: ?,
          //      1: value for current index,
          //      data: SummarisedOlympicRecord for the current country
          //  },
          return d;
        })
        .enter().append('rect')
        .attr('x', (d) => {
          return xScale(d.data.country);
        })
        .attr('y', (d) => {
          return yScale(d[1]);
        })
        .attr('height', (d) => {
          return yScale(d[0]) - yScale(d[1]);
        })
        .attr('width', xScale.bandwidth());

      // add the x-axis
      this.svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(D3.axisBottom(xScale));

      // add the y-axis
      this.svg.append('g')
        .attr('class', 'axis')
        .call(D3.axisLeft(yScale))
        .append('text')
        .attr('x', 2)
        .attr('y', yScale(yScale.ticks().pop()))
        .attr('dy', '-10px')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start');

      // create the legend
      const legend = this.svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('text-anchor', 'end')
        .selectAll('g')
        .data(keys.slice().reverse())
        .enter().append('g')
        .attr('transform', function (d, i) {
          return 'translate(0,' + i * 20 + ')';
        });

      legend.append('rect')
        .attr('x', this.width - 19)
        .attr('width', 19)
        .attr('height', 19)
        .attr('fill', (key) => {
          return this.colourScale(key);
        });

      legend.append('text')
        .attr('x', this.width - 24)
        .attr('y', 9.5)
        .attr('dy', '0.32em')
        .text((d) => d);
    }
  }
}
