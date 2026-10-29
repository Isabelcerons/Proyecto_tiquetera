import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrdenService, Orden } from '../../services/orden.service';
import { TiqueteraService, MovimientoTiquetera } from '../../services/tiquetera.service';

interface ResumenDiario {
  fecha: string;
  ingresos: {
    efectivo: number;
    tarjeta: number;
    tiquetera: number;
    total: number;
  };
  ordenes: {
    total: number;
    promedio: number;
    cantidad: number;
  };
  movimientos: MovimientoTiquetera[];
}

@Component({
  selector: 'app-reporte-diario',
  templateUrl: './reporte-diario.component.html',
  styleUrls: ['./reporte-diario.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class ReporteDiarioComponent implements OnInit {
  currentDate: string = new Date().toISOString();
  loading = true;
  segmento = 'resumen';
  
  resumenDiario: ResumenDiario = {
    fecha: new Date().toLocaleDateString(),
    ingresos: {
      efectivo: 0,
      tarjeta: 0,
      tiquetera: 0,
      total: 0
    },
    ordenes: {
      total: 0,
      promedio: 0,
      cantidad: 0
    },
    movimientos: []
  };
  
  ordenesDia: Orden[] = [];
  movimientosDia: MovimientoTiquetera[] = [];

  constructor(
    private router: Router,
    private ordenService: OrdenService,
    private tiqueteraService: TiqueteraService
  ) { }

  ngOnInit() {
    this.cargarDatos();
  }

  segmentChanged(event: any) {
    this.segmento = event.detail.value;
  }

  fechaCambiada() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    
    // En un entorno real, haríamos llamadas al API para obtener datos del día seleccionado
    // Por ahora, simulamos datos
    setTimeout(() => {
      // Obtener órdenes de prueba
      const ordenes = this.ordenService.getOrdenesMock();
      
      // Filtrar por la fecha seleccionada (para la demo, mostramos todas)
      this.ordenesDia = ordenes;
      
      // Obtener movimientos de tiquetera (para la demo, usamos los del mock)
      const tiquetera = this.tiqueteraService.getTiqueterasMock()[0];
      this.movimientosDia = this.tiqueteraService.getMovimientosMock(tiquetera?.id || '');
      
      // Calcular resumen
      this.calcularResumen();
      
      this.loading = false;
    }, 1000);
  }

  private calcularResumen() {
    // Reiniciar valores
    this.resumenDiario = {
      fecha: new Date(this.currentDate).toLocaleDateString(),
      ingresos: {
        efectivo: 0,
        tarjeta: 0,
        tiquetera: 0,
        total: 0
      },
      ordenes: {
        total: 0,
        promedio: 0,
        cantidad: 0
      },
      movimientos: [...this.movimientosDia]
    };
    
    // Calcular totales por método de pago
    this.ordenesDia.forEach(orden => {
      if (orden.estado === 'pagada') {
        this.resumenDiario.ordenes.total += orden.total;
        this.resumenDiario.ordenes.cantidad++;
        
        if (orden.metodo_pago === 'tiquetera') {
          this.resumenDiario.ingresos.tiquetera += orden.total;
        } else if (orden.metodo_pago === 'tarjeta') {
          this.resumenDiario.ingresos.tarjeta += orden.total;
        } else {
          this.resumenDiario.ingresos.efectivo += orden.total;
        }
      }
    });
    
    // Calcular totales y promedios
    this.resumenDiario.ingresos.total = 
      this.resumenDiario.ingresos.efectivo + 
      this.resumenDiario.ingresos.tarjeta + 
      this.resumenDiario.ingresos.tiquetera;
      
    this.resumenDiario.ordenes.promedio = 
      this.resumenDiario.ordenes.cantidad > 0 
        ? Math.round(this.resumenDiario.ordenes.total / this.resumenDiario.ordenes.cantidad) 
        : 0;
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  }

  volver() {
    this.router.navigate(['/cajero']);
  }
} 