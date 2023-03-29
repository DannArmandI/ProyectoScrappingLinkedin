import { Component, OnInit, AfterViewInit, Output, ViewChild, Input, ElementRef, NgZone , EventEmitter} from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})

export class GraficosComponent implements OnInit, AfterViewInit {

   @ViewChild('charRef') charRef: ElementRef;
   @Input() type: string;
   @Input() data: any[];
   @Input() series: am4charts.Series[];
   @Input() axisX: am4charts.Axis;
   @Input() axisY: am4charts.Axis;

   private chart: am4charts.Chart;

   constructor(private zone: NgZone) { }

   ngOnInit() {}

   ngAfterViewInit() {
     this.zone.runOutsideAngular(() => {
       const chart:any = am4core.create(this.charRef.nativeElement, am4charts[this.type]);
       chart.xAxes.push(this.axisX);
       chart.yAxes.push(this.axisY);
       this.series.forEach(s => chart.series.push(s));
       chart.data = this.data;
       this.chart = chart;
     });
   }
}