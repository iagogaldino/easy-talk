import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChartWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-chart.component.html',
  styleUrls: ['./widget-chart.component.scss'],
})
export class WidgetChartComponent implements OnInit {
  @Input() widget!: ChartWidget;
  protected chartData: any = {};

  ngOnInit(): void {
    this.prepareChartData();
  }

  private prepareChartData(): void {
    const labels = this.widget.data.map(d => d.label);
    const values = this.widget.data.map(d => d.value);

    this.chartData = {
      labels,
      datasets: [{
        label: this.widget.title || 'Dados',
        data: values,
        backgroundColor: this.getColors(this.widget.chartType),
      }],
    };
  }

  private getColors(_chartType: string): string[] {
    const colors = [
      'rgba(37, 99, 235, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(96, 165, 250, 0.8)',
      'rgba(147, 197, 253, 0.8)',
      'rgba(191, 219, 254, 0.8)',
    ];
    return colors;
  }

  protected getMaxValue(): number {
    return Math.max(...this.widget.data.map(d => d.value), 1);
  }

  protected getColorForIndex(index: number): string {
    const colors = [
      'rgba(37, 99, 235, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(96, 165, 250, 0.8)',
      'rgba(147, 197, 253, 0.8)',
      'rgba(191, 219, 254, 0.8)',
    ];
    return colors[index % colors.length];
  }

  protected trackByLabel(_index: number, item: { label: string; value: number }): string {
    return item.label;
  }
}

