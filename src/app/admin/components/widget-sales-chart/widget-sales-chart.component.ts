import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartData,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  BarElement,
  BarController,
  Tooltip,
  Legend,
} from 'chart.js';
import { SalesChartWidget } from '../../models/widget.model';
import { Chart } from 'chart.js';

// Registrar os componentes necessários do Chart.js
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, LineController, BarElement, BarController, Tooltip, Legend);

@Component({
  selector: 'app-widget-sales-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './widget-sales-chart.component.html',
  styleUrls: ['./widget-sales-chart.component.scss'],
})
export class WidgetSalesChartComponent implements OnInit {
  @Input() widget!: SalesChartWidget;

  public chartType: 'line' | 'bar' = 'line';
  public chartData!: ChartData<'line' | 'bar'>;
  public chartOptions: ChartConfiguration<'line' | 'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
            return `Vendas: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
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

  ngOnInit(): void {
    this.chartType = this.widget.chartType;
    this.prepareChartData();
  }

  private prepareChartData(): void {
    const labels = this.widget.data.map(item => {
      const date = new Date(item.date);
      if (this.widget.period === 'day') {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      } else if (this.widget.period === 'week') {
        return `Sem ${date.getWeek()}`;
      } else {
        return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      }
    });

    const data = this.widget.data.map(item => item.value);

    this.chartData = {
      labels,
      datasets: [
        {
          data,
          label: 'Vendas',
          borderColor: 'rgba(37, 99, 235, 1)',
          backgroundColor: this.chartType === 'bar' 
            ? 'rgba(37, 99, 235, 0.8)'
            : 'rgba(37, 99, 235, 0.1)',
          fill: this.chartType === 'line',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'rgba(37, 99, 235, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    };
  }
}

// Extensão para Date.getWeek()
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function() {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

