import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as pluginlabels from 'chartjs-plugin-datalabels';
import {PatientService} from '../../services/patient.service';
import {Router} from '@angular/router';
import { state } from '@angular/animations';


@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {

    constructor(private router: Router,
                private patientservice: PatientService) {
    }
    public chartType = 'line';
    public lineChartLegend = true;
    public lineChartType = 'line';
    public lineChartPlugins = [pluginAnnotations, pluginlabels];
    private vitalSign: string;
    vitalArray: any[] = [];
    vitalArray2: any[] = [];
    timeArray: any[] = [];
    newsArray: any[] = [];
    private boxMin: any[] = [];
    private boxMax: any[] = [];
    private yaxisMax: any;
    private yaxisMin: any;
    private stepSize: any;

    public chartData: ChartDataSets[] = [
        {
            data: this.vitalArray,
            label: '',
            lineTension: 0,
            pointStyle: 'circle',
            pointRotation: 180,
            fill: false,
            borderColor: 'rgb(0,0,0)', // Change the color of the line
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
                        max: max,
                        min: min,
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
        if (localStorage.getItem('outputVitalParameter') === null) {
            localStorage.setItem('outputVitalParameter', 'getHistoricBloodpressure');
        }
        this.vitalSign = localStorage.getItem('outputVitalParameter');

        if (this.vitalSign === 'bloodPressure') {
            this.patientservice.getGenericHistory(this.vitalSign).subscribe( data => {
                for (let i = 0; i < 4; i++) {
                    this.vitalArray[i] = data.resultSet[(data.resultSet.length - 1) - i].systolic;
                    this.vitalArray2[i] = data.resultSet[(data.resultSet.length - 1) - i].diastolic;
                    this.timeArray[i] = data.resultSet[(data.resultSet.length - 1) - i].time;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                }
            });
            this.changeLineColor('rgb(5, 0, 140)', 0);
            this.changeLineColor('rgb(0, 0, 0)', 1);
            this.chartData[0].pointStyle = 'triangle';
            this.setChartOptions(220, 50, 10);
            this.chartData[0].label = 'Systoliskt';
            this.chartData[1].label = 'Diastoliskt';
        } else if (this.vitalSign === 'getHistoricRespirationAdded') {
            this.patientservice.getGenericHistory('Respiration').subscribe( data => {
                for (let i = 0; i < 4; i++) {
                    this.vitalArray[i] = data.resultSet[(data.resultSet.length - 1) - i].syre;
                    this.timeArray[i] = data.resultSet[(data.resultSet.length - 1) - i].time;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                }
            });
            this.chartData[0].label = 'Tillfört Syre';
            this.setChartOptions(2, 0, 1);
        } else if (this.vitalSign === 'ACVPU') {
            this.patientservice.getGenericHistory(this.vitalSign).subscribe( data => {
                for (let i = 0; i < 4; i++) {
                    this.timeArray[i] = data.resultSet[(data.resultSet.length - 1) - i].time;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                    if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Alert') {
                        this.vitalArray[(data.resultSet.length - 1) - i] = 5;
                    } else if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Förvirring') {
                        this.vitalArray[(data.resultSet.length - 1) - i] = 4;
                    } else if (data.resultSet[i].acvpu === 'Voice') {
                        this.vitalArray[(data.resultSet.length - 1) - i] = 3;
                    } else if (data.resultSet[i].acvpu === 'Pain') {
                        this.vitalArray[(data.resultSet.length - 1) - i] = 2;
                    } else if (data.resultSet[i].acvpu === 'Unresponsive') {
                        this.vitalArray[(data.resultSet.length - 1) - i] = 1;
                    }
                }
            });
            this.chartData[0].label = 'Medvetandegrad';
            this.setChartOptions(6, 0, 1);
        } else {
            this.patientservice.getGenericHistory(this.vitalSign).subscribe( data => {
                for (let i = 0; i < 4; i++) {
                    this.vitalArray[i] = data.resultSet[(data.resultSet.length - 1) - i].vitalsign;
                    this.timeArray[i] = data.resultSet[(data.resultSet.length - 1) - i].time;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                }
            });
            if (this.vitalSign === 'Respiration') {
                this.chartData[0].label = 'Andningsfrekvens';
                this.setChartOptions(26, 7, 3);
            } else if (this.vitalSign === 'Temperature') {
                this.chartData[0].label = 'Temperatur';
                this.setChartOptions(42, 33, 1);
                this.changeLineColor('rgb(6, 201, 58)', 0);
            } else if (this.vitalSign === 'Pulse') {
                this.chartData[0].label = 'Pulsfrekvens';
                this.setChartOptions(160, 20, 10);
                this.changeLineColor('rgb(201, 7, 0)', 0);
            } else if (this.vitalSign === 'Oximetry') {
                this.chartData[0].label = 'Syremättnad';
                this.setChartOptions(100, 82, 2);
            }
            console.log(this.timeArray);
        }
    }

    private setCurrentData() {
        console.log(localStorage.getItem('form'));
        const data = JSON.parse(localStorage.getItem('form'));
        let setCurrentData = false;

        if (this.vitalSign === 'bloodPressure') {
            if (data.systolicBloodPressure !== '' && data.systolicBloodPressure !== null)  {
                this.vitalArray[4] = data.systolicBloodPressure;
                setCurrentData = true;
            }
            if (data.diastolicBloodPressure !== '') {
                this.vitalArray2[4] = data.diastolicBloodPressure;
                setCurrentData = true;
            }
        } else if (this.vitalSign === 'getHistoricRespirationAdded') {
            if (data.supplementalOxygen === '2') {
                this.vitalArray[4] = 'false';
                setCurrentData = true;
            } else if (data.supplementalOxygen === '1') {
                this.vitalArray[4] = 'true';
                setCurrentData = true;
            }
        } else if (this.vitalSign === 'ACVPU' && data.consciousnessACVPU !== '' && data.consciousnessACVPU !== null) {
            this.vitalArray[4] = data.consciousnessACVPU;
            setCurrentData = true;
        } else if (this.vitalSign === 'Respiration' && data.respiratoryRate !== '' && data.respiratoryRate !== null) {
            this.vitalArray[4] = data.respiratoryRate;
            setCurrentData = true;
        } else if (this.vitalSign === 'Temperature' && data.temperature !== '' && data.temperature !== null) {
            this.vitalArray[4] = data.temperature;
            setCurrentData = true;
        } else if (this.vitalSign === 'Pulse' && data.pulseRate !== '' && data.pulseRate !== null) {
            this.vitalArray[4] = data.pulseRate;
            setCurrentData = true;
        } else if (this.vitalSign === 'Oximetry' && data.oxygenSaturation !== '' && data.oxygenSaturation !== null) {
            this.vitalArray[4] = data.oxygenSaturation;
            setCurrentData = true;
        }
        if (setCurrentData) {
            this.timeArray[4] = new Date();
            this.chartLabels[4] = 'Nuvarande värde';
            // const date = new Date();
            // this.timeArray[4] = new Date();
            // this.chartLabels[4] = date.toTimeString().substring(0, 8);
        }
    }
    ngOnInit() {
        this.fetchDataApi();
        this.setCurrentData();
    }
}
