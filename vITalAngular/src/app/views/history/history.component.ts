import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { state } from '@angular/animations';


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
    private vitalSign: string;
    private vitalArray: any[] = [];
    private vitalArray2: any[] = [];
    private timeArray: any[] = [];
    private chartLabel: string;
    public yaxisMax: any;
    public yaxisMin: any;

    public chartData: ChartDataSets[] = [
        {
            data: this.vitalArray,
            label: 'Vitalparameter 1',
            lineTension: 0.2,
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
            data: this.vitalArray2,
            label: 'Vitalparameter 2',
            lineTension: 0.2,
            pointStyle: 'triangle',
            fill: false,
            borderColor: 'rgba(223, 128, 255, 1)', // Change the color of the line
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(223, 128, 255, 1)', // Change the color of the point
            pointBorderColor: 'rgba(223, 128, 255, 1)',
        },
    ];
    public chartLabels: Label[] = this.timeArray;
    public chartOptions: (ChartOptions & { annotation: any });
    public setChartOptions() {
        if (this.vitalSign === 'getHistoricBloodpressure') { //print the graph to be used with historic bloodpressure
           console.log("getHistoricBloodpressure");
            this.chartOptions = {
                responsive: true,
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            min: 0,
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
        } else if (this.vitalSign === 'getHistoricRespiration') {
            console.log("getHistoricRespiration");
            this.chartOptions = {
                responsive: true,
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            min: 8,
                            max: 25,
                            stepSize: 3
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {}
                    }]
                },
                annotation: {
                    annotations: [{
                    }],
                }
            };
        } else if (this.vitalSign === 'getHistoricACVPU') {
            console.log("getHistoricACVPU");
            this.chartOptions = {
                responsive: true,
                scales: {
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display:true,
                        },
                        ticks: {
                            min: 1,
                            max: 5,
                            stepSize: 1,
                            callback: function(label, index, labels) {
                                switch (label) {
                                    case 1:
                                        return 'U';
                                    case 2:
                                        return 'P';
                                    case 3:
                                        return 'V';
                                    case 4:
                                        return 'C';
                                    case 5:
                                        return 'A';
                                }
                            }
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {}
                    }]
                },
                annotation: {
                    annotations: [{
                    }],
                }
            };  
        } else if (this.vitalSign === 'getHistoricOximetry'){
            console.log("getHistoricOximetry");
            this.chartOptions = {
                responsive: true,
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            min: 90,
                            max: 100,
                            stepSize: 1
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {}
                    }]
                },
                annotation: {
                    annotations: [{
                    }],
                }
            };
        } else if (this.vitalSign === 'getHistoricPulse'){
            console.log("getHistoricPulse");
            this.chartOptions = {
                responsive: true,
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            min: 20,
                            max: 140,
                            stepSize: 10
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {}
                    }]
                },
                annotation: {
                    annotations: [{
                    }],
                }
            };
        } else if (this.vitalSign === 'getHistoricTemperature'){
            console.log("getHistoricTemperature");
            this.chartOptions = {
                responsive: true,
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            min: 34,
                            max: 40,
                            stepSize: 1
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {}
                    }]
                },
                annotation: {
                    annotations: [{
                    }],
                }
            };
        }
    }
    public chartType = 'line';
    public lineChartLegend = true;
    public lineChartType = 'line';
    public lineChartPlugins = [pluginAnnotations];

    @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

    public fetchDataApi() {
        if (localStorage.getItem('outputVitalParameter') === null) {
            localStorage.setItem('outputVitalParameter', 'getHistoricBloodpressure');
        }
        this.vitalSign = localStorage.getItem('outputVitalParameter');
        console.log(this.vitalSign);

        if (this.vitalSign === 'getHistoricBloodpressure') {
            this.patientservice[this.vitalSign](localStorage.getItem('EHRID')).subscribe(data => {
                for (let i = 0; i < 10; i++) {
                    this.vitalArray[i] = data.resultSet[i].systolic;
                    this.vitalArray2[i] = data.resultSet[i].diastolic;
                    this.timeArray[i] = data.resultSet[i].time;
                }
                console.log(this.vitalArray);
            });
        } else if (this.vitalSign === 'getHistoricRespiration') {
            return this.patientservice.getHistoricRespiration(localStorage.getItem('EHRID')).subscribe(data => {
                for (let i = 0; i < 10; i++) {
                    this.vitalArray[i] = data.resultSet[i].syre;
                    this.timeArray[i] = data.resultSet[i].time;
                }
                console.log(this.vitalArray);
            });
        } else if (this.vitalSign === 'getHistoricACVPU') {
            this.patientservice[this.vitalSign](localStorage.getItem('EHRID')).subscribe(data => {
                for (let i = 0; i < 10; i++) {
                    this.timeArray[i] = data.resultSet[i].time;
                    if (data.resultSet[i].acvpu === 'Alert') {
                        this.vitalArray[i] = 5;
                    } else if (data.resultSet[i].acvpu === 'Confusion') {
                        this.vitalArray[i] = 4;
                    } else if (data.resultSet[i].acvpu === 'Verbal') {
                        this.vitalArray[i] = 3;
                    } else if (data.resultSet[i].acvpu === 'Pain') {
                        this.vitalArray[i] = 2;
                    } else if (data.resultSet[i].acvpu === 'Unresponsive') {
                        this.vitalArray[i] = 1;
                    }
                }
                console.log(this.vitalArray);
            });
        } else {
            console.log(this.vitalArray);
            this.patientservice[this.vitalSign](localStorage.getItem('EHRID')).subscribe(data => {
                for (let i = 0; i < 10; i++) {
                    this.vitalArray[i] = data.resultSet[i].vitalsign;
                    this.timeArray[i] = data.resultSet[i].time;
                }
                console.log(this.vitalArray);
            });
            /*   if (this.vitalSign === 'getHistoricRespiration') {
                   this.chartLabel = 'Andningsfrekvens';
               } else if (this.vitalSign === 'getHistoricTemperature') {
                   this.chartLabel = 'Temperatur';
               } else if (this.
               vitalSign === 'getHistoricPulse') {
                   this.chartLabel = 'Puls'; }
               console.log(this.chartLabel);*/
        }
    }
    ngOnInit() {
        this.fetchDataApi();
        this.setChartOptions();
    }
    goBack() {
        // om du ska använda denna måste du skapa den i konstruktorn som jag gjorde ovanför.
        // pillade lite med unittests och detta crasha allt hela tiden ;)
        this.location.back();
    }

}
