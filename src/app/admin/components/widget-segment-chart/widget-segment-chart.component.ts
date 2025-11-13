import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartData,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
} from 'chart.js';
import { SegmentChartWidget } from '../../models/widget.model';
import { Chart } from 'chart.js';

// Registrar os componentes necessários do Chart.js
Chart.register(ArcElement, PieController, Tooltip, Legend);

@Component({
  selector: 'app-widget-segment-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './widget-segment-chart.component.html',
  styleUrls: ['./widget-segment-chart.component.scss'],
})
export class WidgetSegmentChartComponent implements OnInit {
  @Input() widget!: SegmentChartWidget;

  public chartType: 'pie' | 'doughnut' = 'pie';
  public chartData!: ChartData<'pie' | 'doughnut'>;
  public chartOptions: ChartConfiguration<'pie' | 'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 15,
          font: {
            size: 12,
          },
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
            const label = context.label || '';
            const value = context.parsed;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toLocaleString('pt-BR')} clientes (${percentage}%)`;
          },
        },
      },
    },
  };

  ngOnInit(): void {
    this.chartType = this.widget.chartType;
    this.prepareChartData();
  }

  private prepareChartData(): void {
    const labels = this.widget.data.map(item => item.segment);
    const data = this.widget.data.map(item => item.count);
    const colors = this.widget.data.map(item => item.color);

    this.chartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.map(c => c + 'CC'), // Adiciona transparência
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    };
  }
}

