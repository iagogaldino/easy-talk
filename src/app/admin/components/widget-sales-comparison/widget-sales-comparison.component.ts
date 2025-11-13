import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartData,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Legend,
} from 'chart.js';
import { SalesComparisonWidget } from '../../models/widget.model';
import { Chart } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Tooltip, Legend);

@Component({
  selector: 'app-widget-sales-comparison',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './widget-sales-comparison.component.html',
  styleUrls: ['./widget-sales-comparison.component.scss'],
})
export class WidgetSalesComparisonComponent implements OnInit {
  @Input() widget!: SalesComparisonWidget;

  public chartType: 'line' = 'line';
  public chartData!: ChartData<'line'>;
  public chartOptions: ChartConfiguration<'line'>['options'] = {} as ChartConfiguration<'line'>['options'];

  ngOnInit(): void {
    this.prepareChartData();
    this.initializeChartOptions();
  }

  private initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
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
              const value = context.parsed.y;
              if (value === null || value === undefined) return '';
              return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            },
          },
        },
      },
      scales: {
        x: {
          type: 'category',
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
        },
        y: {
          type: 'linear',
          beginAtZero: true,
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
      },
    };
  }

  private prepareChartData(): void {
    const labels = this.widget.comparison.period1.data.map(item => 
      new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    );

    this.chartData = {
      labels,
      datasets: [
        {
          label: this.widget.comparison.period1.label,
          data: this.widget.comparison.period1.data.map(item => item.value),
          borderColor: 'rgba(37, 99, 235, 0.8)',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
        },
        {
          label: this.widget.comparison.period2.label,
          data: this.widget.comparison.period2.data.map(item => item.value),
          borderColor: 'rgba(76, 175, 80, 0.8)',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  getChangeClass(): string {
    return this.widget.comparison.change.direction === 'up' ? 'change-up' : 'change-down';
  }

  Math = Math;
}

