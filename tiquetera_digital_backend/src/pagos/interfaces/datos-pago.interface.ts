export interface DatosPago {
  pedido_id: string;
  metodo_pago: 'efectivo' | 'tiquetera';
  monto: number;
  monto_efectivo?: number;
  tiquetera_id?: string;
  vuelto?: number;
} 