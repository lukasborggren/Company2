import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {
  constructor(private location: Location) { }


  public chartData: ChartDataSets[] = [
    { data: [140, 187, 170, 150, 155],
     label: 'Systoliskt blodtryck',
     lineTension: 0,
     pointStyle: 'triangle',
     pointRotation: 180,
     fill: false,
     borderColor: 'rgba(20, 20, 250, 1)', // Change the color of the line
     borderWidth: 2,
     pointRadius: 4,
     pointBackgroundColor: 'rgb(20, 20, 255)', // Change the color of the point
     pointBorderColor: 'rgb(20, 20, 255)',
     pointHoverBackgroundColor: '#000',
     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      data: [89, 92, 90, 95, 92],
      label: 'Diastoliskt blodtryck',
      lineTension: 0,
      pointStyle: 'triangle',
      fill: false,
      borderColor: 'rgba(223, 128, 255, 1)', // Change the color of the line
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: 'rgba(223, 128, 255, 1)', // Change the color of the point
      pointBorderColor: 'rgba(223, 128, 255, 1)',
    },
  ];
  public chartLabels: Label[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  public chartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          min: 50,
          max: 240,
          stepSize: 20
        }
      }],
      xAxes: [{
        display: true,
        scaleLabel: {}
      }]
    },
    annotation: {
      annotations: [{
        type: 'box',
        yScaleID: 'y-axis-0',
        yMin: 220,
        yMax: 240,
        backgroundColor: 'rgba(255, 31, 25, 0.2)',
        borderColor: 'rgba(255, 31, 25, 0.2)',
        },
        {
          type: 'box',
          yScaleID: 'y-axis-0',
          yMin: 100,
          yMax: 110,
          backgroundColor: 'rgba(255, 251, 25, 0.2)',
          borderColor: 'rgba(255, 251, 25, 0.2)',
        },
        {
          type: 'box',
          yScaleID: 'y-axis-0',
          yMin: 90,
          yMax: 100,
          backgroundColor: 'rgba(255, 128, 0, 0.2)',
          borderColor: 'rgba(255, 128, 0, 0.2)',
        },
        {
          type: 'box',
          yScaleID: 'y-axis-0',
          yMin: 50,
          yMax: 90,
          backgroundColor: 'rgba(255, 31, 25, 0.2)',
          borderColor: 'rgba(255, 31, 25, 0.2)',
        },
      ],
    },
  };

  public chartType = 'line';
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  ngOnInit() {
  }
  goBack() {
    // om du ska använda denna måste du skapa den i konstruktorn som jag gjorde ovanför.
    // pillade lite med unittests och detta crasha allt hela tiden ;)
    this.location.back();
 }

}
