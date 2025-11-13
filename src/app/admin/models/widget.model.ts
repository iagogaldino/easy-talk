export type WidgetType = 'card' | 'chart' | 'table' | 'button' | 'input' | 'text' | 'list' | 'metric' | 'seller-chart';

export interface BaseWidget {
  id: string;
  type: WidgetType;
  title?: string;
}

export interface CardWidget extends BaseWidget {
  type: 'card';
  content: string;
  color?: 'primary' | 'accent' | 'warn' | 'default';
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

export interface ChartWidget extends BaseWidget {
  type: 'chart';
  chartType: 'line' | 'bar' | 'pie' | 'doughnut';
  data: Array<{ label: string; value: number }>;
  labels?: string[];
}

export interface TableWidget extends BaseWidget {
  type: 'table';
  columns: string[];
  rows: string[][];
}

export interface ButtonWidget extends BaseWidget {
  type: 'button';
  label: string;
  action: string;
  color?: 'primary' | 'accent' | 'warn';
}

export interface InputWidget extends BaseWidget {
  type: 'input';
  placeholder?: string;
  label?: string;
  inputType?: 'text' | 'number' | 'email' | 'password';
}

export interface TextWidget extends BaseWidget {
  type: 'text';
  content: string;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
}

export interface ListWidget extends BaseWidget {
  type: 'list';
  items: string[];
  ordered?: boolean;
}

export interface MetricWidget extends BaseWidget {
  type: 'metric';
  value: string | number;
  label: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export interface SellerChartWidget extends BaseWidget {
  type: 'seller-chart';
  sellers: Array<{
    name: string;
    clientsCount: number;
    avatar?: string;
  }>;
}

export type Widget = 
  | CardWidget 
  | ChartWidget 
  | TableWidget 
  | ButtonWidget 
  | InputWidget 
  | TextWidget 
  | ListWidget 
  | MetricWidget
  | SellerChartWidget;

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  widget?: Widget;
}

