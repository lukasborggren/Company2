import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as pluginlabels from 'chartjs-plugin-datalabels';
import {PatientService} from '../../services/patient.service';
import {Router} from '@angular/router';
import { state } from '@angular/animations';
import { NewsScoreCalculatorService } from '../../services/news-score-calculator.service';


@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {

    constructor(private router: Router,
                private patientservice: PatientService,
                private newsScoreCalculatorService: NewsScoreCalculatorService) {
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
        //-----------If the history for bloodpressure is viewed the following code is run------------
        if (this.vitalSign === 'bloodPressure') {
            this.patientservice.getGenericHistory(this.vitalSign).subscribe( data => {
                for (let i = 0; i < 4; i++) {
                    this.vitalArray[i] = data.resultSet[(data.resultSet.length - 1) - i].systolic;
                    this.vitalArray2[i] = data.resultSet[(data.resultSet.length - 1) - i].diastolic;
                    this.timeArray[i] = data.resultSet[(data.resultSet.length - 1) - i].time;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                    this.newsArray[i] = this.newsScoreCalculatorService.getSystolicScore(this.vitalArray[i]);
                }
            });
            this.changeLineColor('rgb(5, 0, 140)', 0);
            this.changeLineColor('rgb(0, 0, 0)', 1);
            this.chartData[0].pointStyle = 'triangle';
            this.setChartOptions(220, 50, 10);
            this.chartData[0].label = 'Systoliskt';
            this.chartData[1].label = 'Diastoliskt';
            //-------------If the history for syrgas is viewed the following code is run---------------
        } else if (this.vitalSign === 'getHistoricRespirationAdded') {
            this.patientservice.getGenericHistory('Respiration').subscribe( data => {
                for (let i = 0; i < 4; i++) {
                    this.vitalArray[i] = data.resultSet[i].syre;
                    this.timeArray[i] = data.resultSet[(data.resultSet.length - 1) - i].time;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                    if ( this.vitalArray[i] === false) {
                        this.newsArray[i] = 0;
                    } else {
                        this.newsArray[i] = 2;
                    }
                }
            });
            this.chartData[0].label = 'Tillfört Syre';
            this.setChartOptions(2, 0, 1);
            //--------------If the history for medvetandegrad is viewed the following code is run---------------
        } else if (this.vitalSign === 'ACVPU') {
            this.patientservice.getGenericHistory(this.vitalSign).subscribe( data => {
                for (let i = 0; i < 4; i++) {
                    this.timeArray[i] = data.resultSet[(data.resultSet.length - 1) - i].time;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                    if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Alert') {
                        this.vitalArray[i] = 5;
                        this.newsArray[i] = 0;
                    } else if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Förvirring') {
                        this.vitalArray[i] = 4;
                        this.newsArray[i] = 3;
                    } else if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Voice') {
                        this.vitalArray[i] = 3;
                        this.newsArray[i] = 3;
                    } else if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Pain') {
                        this.vitalArray[i] = 2;
                        this.newsArray[i] = 3;
                    } else if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Unresponsive') {
                        this.vitalArray[i] = 1;
                        this.newsArray[i] = 3;
                    }
                }
            });
            this.chartData[0].label = 'Medvetandegrad';
            this.setChartOptions(6, 0, 1);
            //----------If the history for puls, temperatur, andningsfrekvens or syremättnad is viewed the following code is run-----------------
        } else {
            this.patientservice.getGenericHistory(this.vitalSign).subscribe( data => {
                for (let i = 0; i < 4; i++) {
                    this.vitalArray[i] = data.resultSet[(data.resultSet.length - 1) - i].vitalsign;
                    this.timeArray[i] = data.resultSet[(data.resultSet.length - 1) - i].time;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                }
                if (this.vitalSign === 'Respiration') {
                    this.chartData[0].label = 'Andningsfrekvens';
                    this.setChartOptions(26, 7, 3);
                    for (let i = 0; i < 4; i++) {
                        this.newsArray[i] = this.newsScoreCalculatorService.getRespiratoryScore(this.vitalArray[i]);
                    }
                } else if (this.vitalSign === 'Temperature') {
                    this.chartData[0].label = 'Temperatur';
                    this.setChartOptions(42, 33, 1);
                    this.changeLineColor('rgb(6, 201, 58)', 0);
                    for (let i = 0; i < 4; i++) {
                        this.newsArray[i] = this.newsScoreCalculatorService.getTemperatureScore(this.vitalArray[i]);
                    }
                } else if (this.vitalSign === 'Pulse') {
                    this.chartData[0].label = 'Pulsfrekvens';
                    this.setChartOptions(160, 20, 10);
                    this.changeLineColor('rgb(201, 7, 0)', 0);
                    for (let i = 0; i < 4; i++) {
                        this.newsArray[i] = this.newsScoreCalculatorService.getPulseScore(this.vitalArray[i]);
                    }
                } else if (this.vitalSign === 'Oximetry') {
                    this.chartData[0].label = 'Syremättnad';
                    this.setChartOptions(100, 82, 2);
                    for (let i = 0; i < 4; i++) {
                        this.newsArray[i] = this.newsScoreCalculatorService.getSaturationScore(this.vitalArray[i]);
                    }
                }
            });
        }
    }

    private setCurrentData() {
        console.log(localStorage.getItem('form'));
        const data = JSON.parse(localStorage.getItem('form'));
        let setCurrentData = false;

        if (this.vitalSign === 'bloodPressure') {
            if (data.systolicBloodPressure !== '' && data.systolicBloodPressure !== null)  {
                this.vitalArray[4] = data.systolicBloodPressure;
                this.newsArray[4] = this.newsScoreCalculatorService.getSystolicScore(data.systolicBloodPressure);
                setCurrentData = true;
            }
            if (data.diastolicBloodPressure !== '') {
                this.vitalArray2[4] = data.diastolicBloodPressure;
                setCurrentData = true;
            }
        } else if (this.vitalSign === 'getHistoricRespirationAdded') {
            if (data.supplementalOxygen === '2') {
                this.vitalArray[4] = false;
                this.newsArray[4] = 0;
                setCurrentData = true;
            } else if (data.supplementalOxygen === '1') {
                this.vitalArray[4] = true;
                this.newsArray[4] = 2;
                setCurrentData = true;
            }
        } else if (this.vitalSign === 'ACVPU' && data.consciousnessACVPU !== '' && data.consciousnessACVPU !== null) {
            this.vitalArray[4] = data.consciousnessACVPU;
            if (data.consciousnessACVPU === '5') {
                this.newsArray[4] = 0;
            } else {
                this.newsArray[4] = 3;
            }
            setCurrentData = true;
        } else if (this.vitalSign === 'Respiration' && data.respiratoryRate !== '' && data.respiratoryRate !== null) {
            this.vitalArray[4] = data.respiratoryRate;
            this.newsArray[4] = this.newsScoreCalculatorService.getRespiratoryScore(data.respiratoryRate);
            setCurrentData = true;
        } else if (this.vitalSign === 'Temperature' && data.temperature !== '' && data.temperature !== null) {
            this.vitalArray[4] = data.temperature;
            this.newsArray[4] = this.newsScoreCalculatorService.getTemperatureScore(data.temperature);
            setCurrentData = true;
        } else if (this.vitalSign === 'Pulse' && data.pulseRate !== '' && data.pulseRate !== null) {
            this.vitalArray[4] = data.pulseRate;
            this.newsArray[4] = this.newsScoreCalculatorService.getPulseScore(data.pulseRate);
            setCurrentData = true;
        } else if (this.vitalSign === 'Oximetry' && data.oxygenSaturation !== '' && data.oxygenSaturation !== null) {
            this.vitalArray[4] = data.oxygenSaturation;
            this.newsArray[4] = this.newsScoreCalculatorService.getSaturationScore(data.oxygenSaturation);
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
