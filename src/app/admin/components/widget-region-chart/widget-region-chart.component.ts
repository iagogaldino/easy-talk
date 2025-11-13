import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
} from 'chart.js';
import { RegionChartWidget } from '../../models/widget.model';
import { Chart } from 'chart.js';

// Registrar os componentes necessários do Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, BarController, ArcElement, PieController, Tooltip, Legend);

@Component({
  selector: 'app-widget-region-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './widget-region-chart.component.html',
  styleUrls: ['./widget-region-chart.component.scss'],
})
export class WidgetRegionChartComponent implements OnInit {
  @Input() widget!: RegionChartWidget;

  public chartType: 'bar' | 'pie' | 'doughnut' = 'bar';
  public chartData!: ChartData<'bar' | 'pie' | 'doughnut'>;
  public chartOptions: ChartConfiguration<'bar' | 'pie' | 'doughnut'>['options'] = {} as ChartConfiguration<'bar' | 'pie' | 'doughnut'>['options'];
  
  ngOnInit(): void {
    this.chartType = this.widget.chartType;
    this.initializeChartOptions();
    this.prepareChartData();
  }

  private initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
        tooltip: {
          backgroundColor: 'rgba(40, 40, 40, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              if (this.chartType === 'bar') {
                const value = context.parsed.y;
                if (value === null || value === undefined) return '';
                return `Vendas: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
              } else {
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const value = context.parsed;
                if (typeof value !== 'number') return '';
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: R$ ${value.toLocaleString('pt-BR')} (${percentage}%)`;
              }
            },
          },
        },
      },
    };
  }

  private prepareChartData(): void {
    if (this.chartType === 'bar') {
      const labels = this.widget.data.map(item => item.region);
      const salesData = this.widget.data.map(item => item.sales);
      const clientsData = this.widget.data.map(item => item.clients);
      const colors = this.generateColors(this.widget.data.length);

      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Vendas (R$)',
            data: salesData,
            backgroundColor: colors[0],
            borderColor: colors[0].replace('0.8', '1'),
            borderWidth: 2,
            borderRadius: 8,
          },
          {
            label: 'Clientes',
            data: clientsData.map(c => c * 100), // Escala para visualização
            backgroundColor: colors[1],
            borderColor: colors[1].replace('0.8', '1'),
            borderWidth: 2,
            borderRadius: 8,
            yAxisID: 'y1',
          },
        ],
      };

      this.chartOptions = {
        ...this.chartOptions,
        scales: {
          x: {
          type: 'category',
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          grid: {
            display: false,
          },
        },
        y: {
          type: 'linear',
          beginAtZero: true,
          position: 'left',
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            callback: (value) => {
              return `R$ ${Number(value).toLocaleString('pt-BR')}`;
            },
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
        },
        y1: {
          type: 'linear',
          beginAtZero: true,
          position: 'right',
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            callback: (value) => {
              return `${Number(value) / 100}`;
            },
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };
    } else {
      const labels = this.widget.data.map(item => item.region);
      const data = this.widget.data.map(item => item.sales);
      const colors = this.generateColors(this.widget.data.length);

      this.chartData = {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderColor: 'rgba(40, 40, 40, 0.8)',
            borderWidth: 2,
          },
        ],
      };
    }
  }

  private generateColors(count: number): string[] {
    const colors = [
      'rgba(37, 99, 235, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(96, 165, 250, 0.8)',
      'rgba(147, 197, 253, 0.8)',
      'rgba(76, 175, 80, 0.8)',
    ];
    
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  }
}

