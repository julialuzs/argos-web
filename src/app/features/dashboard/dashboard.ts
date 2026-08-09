import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexLegend,
  ApexTooltip,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  ApexAnnotations,
  ApexStates,
  ApexTheme,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  title?: ApexTitleSubtitle;
  subtitle?: ApexTitleSubtitle;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  fill?: ApexFill;
  legend?: ApexLegend;
  tooltip?: ApexTooltip;
  markers?: ApexMarkers;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  grid?: ApexGrid;
  annotations?: ApexAnnotations;
  states?: ApexStates;
  theme?: ApexTheme;
  colors?: string[];
  labels?: any;
};

@Component({
  selector: 'app-dashboard',
  imports: [DividerModule, ButtonModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit {
  @ViewChild('chart') chart!: ChartComponent;

  public barChartOptions: Partial<ChartOptions> = {
    title: {
      text: 'Erros/Avisos/Pontuação por Data',
      align: 'left',
    },
    series: [
      {
        name: 'Erros',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: 'Avisos',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: 'Pontuação',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      // alterar para as datas dos relatorios
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return '$ ' + val + ' thousands';
        },
      },
    },
  };

  public chartOptions: Partial<ChartOptions> = {
    series: [30, 25, 18, 13, 20],
    chart: {
      type: 'donut',
      width: 420,
    },
    labels: ['Crítico', 'Grave', 'Moderado', 'Baixa', 'Informativa'],
    colors: ['#F43F5E', '#F59E0B', '#14B8A6', '#0EA5E9', '#0EA5E9'],
    plotOptions: {
      pie: {
        // Round the corners of every slice (px)
        borderRadius: 12,
        // Leave a gap between adjacent slices (px)
        spacing: 5,
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Orders',
            },
          },
        },
      },
    },
    stroke: {
      width: 0,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
    },
    title: {
      text: 'Achados por Severidade',
      align: 'left',
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 320,
          },
        },
      },
    ],
  };

  ngAfterViewInit() {
    (window as any).ApexCharts.setLicense(
      'APEX-eyJleHBpcnlEYXRlIjoiMjEyNi0wNy0wNCIsImlzc3VlRGF0ZSI6IjIwMjYtMDctMjgiLCJwbGFuIjoicHJlbWl1bSIsImRvbWFpbnMiOlsiYXBleGNoYXJ0cy5jb20iLCIxMjcuMC4wLjEiLCJsb2NhbGhvc3QiXSwic2lnIjoieVBmb1VCc0Z3TU9ZdUEyaEZkR0I2Y1FtZ0JITUtXcVdJSjB2NVRESXRZbFR3eDJMUmh6R2x0RUc3VXJ4X0s3b25ZMWRZb2Z2VGItN01ydFYyNDVyOWcifQ==',
    );
  }

  getDadosDashboard() {}
}
