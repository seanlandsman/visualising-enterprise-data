import {
  AfterViewInit, Component, ComponentFactoryResolver, Input, OnChanges, SimpleChanges, ViewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'app-chart-manager',
  templateUrl: './chart-manager.component.html',
  styleUrls: ['./chart-manager.component.css']
})
export class ChartManagerComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartComponent', {read: ViewContainerRef}) chartComponentHost;

  @Input('chartComponent') currentChartComponent: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngAfterViewInit() {
    this.loadComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadComponent();
  }

  private loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.currentChartComponent);

    this.chartComponentHost.clear();
    this.chartComponentHost.createComponent(componentFactory);
  }
}
