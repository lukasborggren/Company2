import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as pluginlabels from 'chartjs-plugin-datalabels';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { templateJitUrl } from '@angular/compiler';
import { tick } from '@angular/core/testing';
import { callbackify } from 'util';


@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {

    constructor(private location: Location,
        private router: Router,
        private patientservice: PatientService) {
    }
    public chartType = 'line';
    public lineChartLegend = true;
    public lineChartType = 'line';
    public lineChartPlugins = [pluginAnnotations, pluginlabels];
    private vitalSign: string;
    private vitalArray: any[] = [];
    private vitalArray2: any[] = [];
    private timeArray: any[] = [];
    private boxMin: any[] = [];
    private boxMax: any[] = [];

    public chartData: ChartDataSets[] = [
        {
            data: this.vitalArray,
            label: '',
            lineTension: 0,
            pointStyle: 'circle',
            pointRotation: 180,
            fill: false,
            borderColor: 'rgba(20, 20, 250, 1)', // Change the color of the line
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(0, 0, 0)', // Change the color of the point
            pointBorderColor: 'rgb(0, 0, 0)',
            pointHoverBorderColor: 'rgb(0, 0, 0)'
        },
        {
            data: this.vitalArray2,
            label: '',
            lineTension: 0,
            pointStyle: 'triangle',
            fill: false,
            borderColor: 'rgb(216, 216, 216)', // Change the color of the line
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(216, 216, 216)', // Change the color of the point
            pointBorderColor: 'rgb(216, 216, 216)',
        },
    ];
    public chartLabels: Label[] = [];
    public chartOptions: (ChartOptions /*& { annotation: any }*/);
    public setChartOptions(max, min, steplength) {
        this.chartOptions = {
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    color: 'black',
                    font: {
                        weight: 'bold'
                    },
                }
            },
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        max: min,
                        min: max,
                        stepSize: steplength
                    }
                }],
                xAxes: [{
                }]
            }
            /* annotation: {
                 annotations: [{
                     drawTime: 'beforeDatasetsDraw',
                     //Röd box
                     type: 'box',
                     yScaleID: 'y-axis-0',
                     yMin: this.boxMin[0],
                     yMax: this.boxMax[0],
                     backgroundColor: 'rgba(245, 150, 129, 0.2)',
                     borderColor: 'rgba(245, 150, 129, 0.2)',
                 },
                     {
                         //Orange box
                         type: 'box',
                         yScaleID: 'y-axis-0',
                         yMin: this.boxMin[1],
                         yMax: this.boxMax[1],
                         backgroundColor: 'rgba(255, 128, 0, 0.2)',
                         borderColor: 'rgba(255, 128, 0, 0.2)',
                     },
                     {
                         //Gul box
                         type: 'box',
                         yScaleID: 'y-axis-0',
                         yMin: this.boxMin[2],
                         yMax: this.boxMax[2],
                         backgroundColor: 'rgba(255, 251, 25, 0.2)',
                         borderColor: 'rgba(255, 251, 25, 0.2)',
                     },
                     {
                         //Gul box
                         type: 'box',
                         yScaleID: 'y-axis-0',
                         yMin: this.boxMin[3],
                         yMax: this.boxMax[3],
                         backgroundColor: 'rgba(255, 251, 25, 0.2)',
                         borderColor: 'rgba(255, 251, 25, 0.2)',
                     },
                     {
                         //Orange box
                         type: 'box',
                         yScaleID: 'y-axis-0',
                         yMin: this.boxMin[4],
                         yMax: this.boxMax[4],
                         backgroundColor: 'rgba(255, 128, 0, 0.2)',
                         borderColor: 'rgba(255, 128, 0, 0.2)',
                     },
                     {
                         //Röd box
                         type: 'box',
                         yScaleID: 'y-axis-0',
                         yMin: this.boxMin[5],
                         yMax: this.boxMax[5],
                         backgroundColor: 'rgba(245, 150, 129, 0.2)',
                         borderColor: 'rgba(255, 31, 25, 0.2)',
                     },
                 ],
             },*/
        };
    }
    public changeLineColor(color, number) {
        this.chartData[number].pointBackgroundColor = color;
        this.chartData[number].borderColor = color;
        this.chartData[number].pointBorderColor = color;
    }

    @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

    public fetchDataApi() {
        this.changeLineColor('rgb(0, 0, 0)', 0);
        if (localStorage.getItem('outputVitalParameter') === null) {
            localStorage.setItem('outputVitalParameter', 'getHistoricBloodpressure');
        }
        this.vitalSign = localStorage.getItem('outputVitalParameter');

        if (this.vitalSign === 'getHistoricBloodpressure') {
            this.patientservice[this.vitalSign]().subscribe(data => {
                for (let i = 0; i < 4; i++) {
                    this.vitalArray[i] = data.resultSet[(data.resultSet.length - 1) - i].systolic;
                    this.vitalArray2[i] = data.resultSet[(data.resultSet.length - 1) - i].diastolic;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                }
            });
            this.changeLineColor('rgb(5, 0, 140)', 0);
            this.changeLineColor('rgb(0, 0, 0)', 1);
            this.chartData[0].pointStyle = 'triangle';
            this.setChartOptions(50, 220, 10);
            this.chartData[0].label = 'Systoliskt';
            this.chartData[1].label = 'Diastoliskt';
            this.boxMax = [200, 0, 0, 100, 90, 50];
            this.boxMin = [220, 0, 0, 110, 100, 90];
        } else if (this.vitalSign === 'getHistoricRespirationAdded') {
            this.patientservice.getHistoricRespiration().subscribe(data => {
                for (let i = 0; i < 4; i++) {
                    this.vitalArray[i] = data.resultSet[(data.resultSet.length - 1) - i].syre;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                }
            });
            this.setChartOptions(0, 1, 1);
            this.chartData[0].label = 'Tillfört Syre';
            this.boxMax = [0, 0, 0, 0, 2, 0];
            this.boxMin = [0, 0, 0, 0, 1, 0];
        } else if (this.vitalSign === 'getHistoricACVPU') {
            this.patientservice[this.vitalSign]().subscribe(data => {
                for (let i = 0; i < 4; i++) {
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                    if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Alert') {
                        this.vitalArray[(data.resultSet.length - 1) - i] = 5;
                    } else if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Confusion') {
                        this.vitalArray[(data.resultSet.length - 1) - i] = 4;
                    } else if (data.resultSet[i].acvpu === 'Verbal') {
                        this.vitalArray[(data.resultSet.length - 1) - i] = 3;
                    } else if (data.resultSet[i].acvpu === 'Pain') {
                        this.vitalArray[(data.resultSet.length - 1) - i] = 2;
                    } else if (data.resultSet[i].acvpu === 'Unresponsive') {
                        this.vitalArray[(data.resultSet.length - 1) - i] = 1;
                    }
                }
            });
            this.chartData[0].label = 'Medvetandegrad';
            this.setChartOptions(1, 6, 1);
            this.boxMax = [0, 0, 0, 0, 0, 4];
            this.boxMin = [0, 0, 0, 0, 0, 1];
        } else {
            this.patientservice[this.vitalSign](localStorage.getItem('EHR_ID')).subscribe(data => {
                for (let i = 0; i < 4; i++) {
                    this.vitalArray[i] = data.resultSet[(data.resultSet.length - 1) - i].vitalsign;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                }
            });
            if (this.vitalSign === 'getHistoricRespiration') {
                this.chartData[0].label = 'Andningsfrekvens';
                this.setChartOptions(7, 26, 3);
                this.boxMax = [26, 24, 0, 11, 0, 9];
                this.boxMin = [24, 21, 0, 9, 0, 7];
            } else if (this.vitalSign === 'getHistoricTemperature') {
                this.chartData[0].label = 'Temperatur';
                this.setChartOptions(33, 42, 1);  
                this.changeLineColor('rgb(6, 201, 58)', 0);
                this.boxMax = [0, 42, 39, 36, 0, 36];
                this.boxMin = [0, 39, 38, 35, 0, 33];
            } else if (this.vitalSign === 'getHistoricPulse') {
                this.chartData[0].label = 'Pulsfrekvens';
                this.setChartOptions(20, 160, 10);
                this.changeLineColor('rgb(201, 7, 0)', 0);
                this.boxMax = [160, 130, 110, 50, 0, 40];
                this.boxMin = [130, 110, 90, 40, 0, 20];
            } else if (this.vitalSign === 'getHistoricOximetry') {
                this.chartData[0].label = 'Syremättnad';
                this.changeLineColor('rgb(0, 112, 13)', 0);
                this.setChartOptions(88, 100, 1);
                this.boxMax = [0, 0, 0, 96, 94, 92];
                this.boxMin = [0, 0, 0, 94, 92, 88];
            }
        }
    }
    ngOnInit() {
        this.fetchDataApi();
    }
    goBack() {
        // om du ska använda denna måste du skapa den i konstruktorn som jag gjorde ovanför.
        // pillade lite med unittests och detta crasha allt hela tiden ;)
        this.location.back();
    }

}
