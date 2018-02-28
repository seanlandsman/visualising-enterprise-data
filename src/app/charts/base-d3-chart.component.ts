import {ElementRef} from '@angular/core';
import * as D3 from 'D3/index';

export class BaseD3ChartComponent {

  protected svg;
  protected height;
  protected width;
  protected host;

  protected margin = {
    top: 25,
    right: 100,
    bottom: 85,
    left: 0
  };

  protected padding = 40;
  protected colourScale: any = D3.scaleOrdinal(D3.schemeCategory10);

  constructor(_element: ElementRef) {
    this.host = D3.select(_element.nativeElement);
  }

  protected initialiseSizeAndScale() {
    const container = document.querySelector('#chart');
    this.width = container.clientWidth - this.margin.left - this.margin.right;
    this.height = container.clientHeight - this.margin.bottom - this.margin.top;
  }

  protected buildSVG() {
    this.host.html('');
    this.svg = this.host.append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('padding-top', this.padding - 10)
      .style('padding-left', this.padding)
      .style('padding-bottom', this.padding);
  }
}
