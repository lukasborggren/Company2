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

  public chartType = 'line';
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations, pluginlabels];
  public vitalSign: string;
  public vitalArray: any[] = [];
  public vitalArray2: any[] = [];
  public timeArray: any[] = [];
  public newsArray: any[] = [];
  public parameterArray: any[] = [];
  public parameterName: { [id: string] : string; } = {
    'Respiration': 'Andningsfrekvens',
    'Oximetry': 'Syremättnad',
    'getHistoricRespirationAdded': 'Tillförd syrgas',
    'bloodPressure': 'Blodtryck',
    'Pulse': 'Pulsfrekvens',
    'ACVPU': 'Medvetandegrad',
    'Temperature': 'Temperatur'
  };

  public chartData: ChartDataSets[] = [
      {
          data: this.vitalArray,
          label: '',
          lineTension: 0,
          pointStyle: 'circle',
          pointBorderWidth: 7,
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
          pointBorderWidth: 7,
          pointStyle: 'triangle',
          fill: false,
          borderColor: 'rgb(242, 242, 242)', // Change the color of the line
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'rgb(242, 242, 242)', // Change the color of the point
          pointBorderColor: 'rgb(242, 242, 242)',
      },
  ];
  public chartLabels: Label[] = [];
  public chartOptions: (ChartOptions /*& { annotation: any }*/);

  constructor(private router: Router,
    private patientservice: PatientService,
    private newsScoreCalculatorService: NewsScoreCalculatorService) { }

    resetChart() {
      this.chartType = 'line';
      this.lineChartLegend = true;
      this.lineChartType = 'line';
      this.lineChartPlugins = [pluginAnnotations, pluginlabels];
      this.vitalSign = null;
      this.vitalArray = [];
      this.vitalArray2= [];
      this.timeArray = [];
      this.newsArray = [];
      this.parameterArray = [];
      this.chartData = [
        {
          data: this.vitalArray,
          label: '',
          lineTension: 0,
          pointStyle: 'circle',
          pointBorderWidth: 7,
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
          pointBorderWidth: 7,
          pointStyle: 'triangle',
          fill: false,
          borderColor: 'rgb(242, 242, 242)', // Change the color of the line
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'rgb(242, 242, 242)', // Change the color of the point
          pointBorderColor: 'rgb(242, 242, 242)',
        },
      ];
      this.chartLabels = [];
    }

    public setChartOptions(max, min, steplength, parameter) {
        this.chartOptions = {
            plugins: {
                datalabels: {
                    anchor: 'center',
                    color: 'white',
                    font: {
                        size: 7,
                        weight: 'bold',
                    },
                    formatter: function(value, context) {
                        if (parameter === 'ACVPU') {
                            switch(value){
                                case 0:
                                    return null;
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
                                case 6:
                                    return null;
                            }
                        } else if (parameter === 'getHistoricRespirationAdded') {
                            if (value) {
                                return 'Ja'
                            } else {
                                return 'Nej'
                            }
                        }
                    }
                }
            },
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        max: max,
                        min: min,
                        stepSize: steplength,
                        callback: function(label, index, labels) {
                            if (parameter === 'ACVPU') {
                                switch(label){
                                    case 0:
                                        return null;
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
                                    case 6:
                                        return null;
                                }
                            } else if (parameter === 'getHistoricRespirationAdded') {
                                switch(label){
                                    case 0:
                                        return 'Nej';
                                    case 1:
                                        return 'Ja';
                                    case 2:
                                        return null;
                                }
                            }
                            return label;
                        }
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
            this.setChartOptions(220, 50, 10, this.vitalSign);
            this.chartData[0].label = 'Systoliskt';
            this.chartData[1].label = 'Diastoliskt';
            //-------------If the history for syrgas is viewed the following code is run---------------
        } else if (this.vitalSign === 'getHistoricRespirationAdded') {
            this.patientservice.getGenericHistory('Respiration').subscribe( data => {
                for (let i = 0; i < 4; i++) {
                    this.vitalArray[i] = data.resultSet[(data.resultSet.length - 1) - i].syre;
                    this.timeArray[i] = data.resultSet[(data.resultSet.length - 1) - i].time;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                    if ( this.vitalArray[i] === false) {
                        this.newsArray[i] = 0;
                        this.parameterArray[i] = 'Nej';
                    } else {
                        this.newsArray[i] = 2;
                        this.parameterArray[i] = 'Ja';
                    }
                }
            });
            this.chartData[0].label = 'Syrgas';
            this.setChartOptions(2, 0, 1, this.vitalSign);
            //--------------If the history for medvetandegrad is viewed the following code is run---------------
        } else if (this.vitalSign === 'ACVPU') {
            this.patientservice.getGenericHistory(this.vitalSign).subscribe( data => {
                for (let i = 0; i < 4; i++) {
                    this.timeArray[i] = data.resultSet[(data.resultSet.length - 1) - i].time;
                    this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                    if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Alert') {
                        this.vitalArray[i] = 5;
                        this.newsArray[i] = 0;
                        this.parameterArray[i] = 'Alert';
                    } else if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Förvirring') {
                        this.vitalArray[i] = 4;
                        this.newsArray[i] = 3;
                        this.parameterArray[i] = 'Confusion';
                    } else if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Voice') {
                        this.vitalArray[i] = 3;
                        this.newsArray[i] = 3;
                        this.parameterArray[i] = 'Voice';
                    } else if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Pain') {
                        this.vitalArray[i] = 2;
                        this.newsArray[i] = 3;
                        this.parameterArray[i] = 'Pain';
                    } else if (data.resultSet[(data.resultSet.length - 1) - i].acvpu === 'Unresponsive') {
                        this.vitalArray[i] = 1;
                        this.newsArray[i] = 3;
                        this.parameterArray[i] = 'Unresponsive';
                    }
                }
            });
            this.chartData[0].label = 'Medvetandegrad';
            this.setChartOptions(6, 0, 1, this.vitalSign);
          } else if (this.vitalSign == 'News') {
              this.patientservice.getGenericHistory(this.vitalSign).subscribe( data => {
                for (let i = 0; i < 4; i++) {
                  this.parameterArray[i] = data.resultSet[(data.resultSet.length - 1) - i].news2;
                  this.vitalArray[i] = data.resultSet[(data.resultSet.length - 1) - i].news2;
                  this.timeArray[i] = data.resultSet[(data.resultSet.length - 1) - i].time;
                  this.chartLabels[i] = data.resultSet[(data.resultSet.length - 1) - i].time.substring(11, 19);
                }
              });
              this.setChartOptions(12, 0, 1, this.vitalSign);
              this.chartData[0].label = 'Total NEWS';
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
                    this.setChartOptions(26, 7, 3, this.vitalSign);
                    for (let i = 0; i < 4; i++) {
                        this.newsArray[i] = this.newsScoreCalculatorService.getRespiratoryScore(this.vitalArray[i]);
                    }
                } else if (this.vitalSign === 'Temperature') {
                    this.chartData[0].label = 'Temperatur';
                    this.setChartOptions(42, 33, 1, this.vitalSign);
                    this.changeLineColor('rgb(6, 201, 58)', 0);
                    for (let i = 0; i < 4; i++) {
                        this.newsArray[i] = this.newsScoreCalculatorService.getTemperatureScore(this.vitalArray[i]);
                    }
                } else if (this.vitalSign === 'Pulse') {
                    this.chartData[0].label = 'Pulsfrekvens';
                    this.setChartOptions(160, 20, 10, this.vitalSign);
                    this.changeLineColor('rgb(201, 7, 0)', 0);
                    for (let i = 0; i < 4; i++) {
                        this.newsArray[i] = this.newsScoreCalculatorService.getPulseScore(this.vitalArray[i]);
                    }
                } else if (this.vitalSign === 'Oximetry') {
                    this.chartData[0].label = 'Syremättnad';
                    this.setChartOptions(100, 82, 2, this.vitalSign);
                    for (let i = 0; i < 4; i++) {
                        this.newsArray[i] = this.newsScoreCalculatorService.getSaturationScore(this.vitalArray[i]);
                    }
                }
            });
        }
    }

    private setCurrentData() {
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
                this.parameterArray[4] = 'Nej';
                setCurrentData = true;
            } else if (data.supplementalOxygen === '1') {
                this.vitalArray[4] = true;
                this.newsArray[4] = 2;
                this.parameterArray[4] = 'Ja';
                setCurrentData = true;
            }
        } else if (this.vitalSign === 'ACVPU' && data.consciousnessACVPU !== '' && data.consciousnessACVPU !== null) {
            this.vitalArray[4] = data.consciousnessACVPU;
            if (data.consciousnessACVPU === '5') {
                this.vitalArray[4] = 5;
                this.newsArray[4] = 0;
                this.parameterArray[4] = 'Alert';
                setCurrentData = true;
            } else if ((data.consciousnessACVPU === '4')) {
                this.vitalArray[4] = 4;
                this.newsArray[4] = 3;
                this.parameterArray[4] = 'Confusion';
                setCurrentData = true;
            } else if ((data.consciousnessACVPU === '3')) {
                this.vitalArray[4] = 3;
                this.newsArray[4] = 3;
                this.parameterArray[4] = 'Voice';
                setCurrentData = true;
            } else if ((data.consciousnessACVPU === '2')) {
                this.vitalArray[4] = 2;
                this.newsArray[4] = 3;
                this.parameterArray[4] = 'Pain';
                setCurrentData = true;
            } else if ((data.consciousnessACVPU === '1')) {
                this.vitalArray[4] = 1;
                this.newsArray[4] = 3;
                this.parameterArray[4] = 'Unresponsive';
                setCurrentData = true;
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

    changeParam(param: string) {
      this.resetChart();
      localStorage.setItem('outputVitalParameter', param);
      this.fetchDataApi();
    }

    ngOnInit() {
        this.fetchDataApi();
    }
}
