import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, NgZone } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Legend,
  Plugin,
} from 'chart.js';
import { SellerChartWidget } from '../../models/widget.model';
import { Chart } from 'chart.js';
import { Seller, MOCK_SELLERS } from '../../../mocks/admin/mock-sellers';

// Registrar os componentes necessários do Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend);

@Component({
  selector: 'app-widget-seller-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './widget-seller-chart.component.html',
  styleUrls: ['./widget-seller-chart.component.scss'],
})
export class WidgetSellerChartComponent implements OnInit {
  @Input() widget!: SellerChartWidget;
  @Input() onSellerClick?: (seller: Seller) => void;

  public barChartType: 'bar' = 'bar';
  public barChartData!: ChartData<'bar'>;
  public avatars: string[] = [];
  public chartPlugins: Plugin<'bar'>[] = [];
  private loadedImages: Map<string, HTMLImageElement> = new Map();

  constructor(private ngZone: NgZone) {}

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_event, elements) => {
      if (elements.length > 0 && this.onSellerClick) {
        const element = elements[0];
        const index = element.index;
        const sellerData = this.widget.sellers[index];
        if (sellerData) {
          const fullSeller = MOCK_SELLERS.find(s => s.name === sellerData.name) || {
            name: sellerData.name,
            clientsCount: sellerData.clientsCount,
            avatar: sellerData.avatar,
            email: sellerData.name.toLowerCase().replace(' ', '.') + '@empresa.com',
            department: 'Vendas',
          } as Seller;
          
          // Executa dentro da zona do Angular para garantir detecção de mudanças
          this.ngZone.run(() => {
            this.onSellerClick!(fullSeller);
          });
        }
      }
    },
    animations: {
      x: {
        from: 0,
        duration: 800,
        easing: 'easeOutQuart',
        delay: (context: any) => {
          return context.dataIndex * 100;
        },
      },
      y: {
        from: 0,
        duration: 800,
        easing: 'easeOutQuart',
        delay: (context: any) => {
          return context.dataIndex * 100;
        },
      },
      colors: {
        from: 'transparent',
        duration: 800,
        easing: 'easeOutQuart',
        delay: (context: any) => {
          return context.dataIndex * 100;
        },
      },
    },
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
      },
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 50,
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          stepSize: 10,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  };

  ngOnInit(): void {
    this.prepareChartData();
    this.setupAvatarPlugin();
  }

  private prepareChartData(): void {
    const labels = this.widget.sellers.map(seller => seller.name);
    const data = this.widget.sellers.map(seller => seller.clientsCount);
    this.avatars = this.widget.sellers.map(seller => seller.avatar || '');

    this.barChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(37, 99, 235, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(96, 165, 250, 0.8)',
            'rgba(147, 197, 253, 0.8)',
            'rgba(191, 219, 254, 0.8)',
            'rgba(37, 99, 235, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(96, 165, 250, 0.8)',
          ],
          borderColor: [
            'rgba(37, 99, 235, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(96, 165, 250, 1)',
            'rgba(147, 197, 253, 1)',
            'rgba(191, 219, 254, 1)',
            'rgba(37, 99, 235, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(96, 165, 250, 1)',
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  }

  private setupAvatarPlugin(): void {
    // Pré-carregar todas as imagens
    this.avatars.forEach((avatar) => {
      if (avatar && !this.loadedImages.has(avatar)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          this.loadedImages.set(avatar, img);
        };
        img.src = avatar;
      }
    });

    this.chartPlugins = [
      {
        id: 'avatarPlugin',
        afterDraw: (chart) => {
          const ctx = chart.ctx;
          const meta = chart.getDatasetMeta(0);
          const yAxis = chart.scales['y'];
          const imageSize = 36;

          meta.data.forEach((bar: any, index: number) => {
            if (this.avatars[index]) {
              const x = bar.x;
              const y = yAxis.bottom + 30;
              const avatarUrl = this.avatars[index];
              const img = this.loadedImages.get(avatarUrl);
              
              if (img && img.complete) {
                // Desenha a imagem do avatar
                ctx.save();
                ctx.beginPath();
                ctx.arc(x, y, imageSize / 2, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(img, x - imageSize / 2, y - imageSize / 2, imageSize, imageSize);
                ctx.restore();

                // Adiciona uma borda ao avatar
                ctx.save();
                ctx.beginPath();
                ctx.arc(x, y, imageSize / 2, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
              } else {
                // Se a imagem não carregou, desenha um círculo com inicial
                ctx.save();
                ctx.beginPath();
                ctx.arc(x, y, imageSize / 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(37, 99, 235, 0.8)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px Roboto';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.widget.sellers[index].name[0].toUpperCase(), x, y);
                ctx.restore();
              }
            }
          });
        },
      },
      {
        id: 'avatarClickPlugin',
        afterEvent: (chart, args) => {
          const event = args.event;
          if (event.type === 'click' && event.x !== null && event.y !== null) {
            const meta = chart.getDatasetMeta(0);
            const yAxis = chart.scales['y'];
            const imageSize = 36;
            const clickX = event.x;
            const clickY = event.y;

            meta.data.forEach((bar: any, index: number) => {
              const x = bar.x;
              const y = yAxis.bottom + 30;
              const distance = Math.sqrt(Math.pow(clickX - x, 2) + Math.pow(clickY - y, 2));
              
              // Verifica se o clique foi no avatar (raio de 20px)
              if (distance <= imageSize / 2 + 5 && this.onSellerClick) {
                const sellerData = this.widget.sellers[index];
                if (sellerData) {
                  const fullSeller = MOCK_SELLERS.find(s => s.name === sellerData.name) || {
                    name: sellerData.name,
                    clientsCount: sellerData.clientsCount,
                    avatar: sellerData.avatar,
                    email: sellerData.name.toLowerCase().replace(' ', '.') + '@empresa.com',
                    department: 'Vendas',
                  } as Seller;
                  
                  // Executa dentro da zona do Angular para garantir detecção de mudanças
                  this.ngZone.run(() => {
                    this.onSellerClick!(fullSeller);
                  });
                }
              }
            });
          }
        },
      },
    ];
  }

}

