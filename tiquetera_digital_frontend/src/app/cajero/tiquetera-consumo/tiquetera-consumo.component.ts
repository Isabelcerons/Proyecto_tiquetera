import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TiqueteraService, Tiquetera, MovimientoTiquetera } from '../../services/tiquetera.service';

@Component({
  selector: 'app-tiquetera-consumo',
  templateUrl: './tiquetera-consumo.component.html',
  styleUrls: ['./tiquetera-consumo.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule]
})
export class TiqueteraConsumoComponent implements OnInit {
  tiquetera: Tiquetera | null = null;
  movimientos: MovimientoTiquetera[] = [];
  tiqueteraId: string = '';
  loading = true;
  formLoading = false;
  consumoForm: FormGroup;
  errorMessage = '';
  activeTab = 'info';
  consumoExitoso = false;

  constructor(
    private tiqueteraService: TiqueteraService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.consumoForm = this.fb.group({
      monto: [null, [Validators.required, Validators.min(1)]],
      descripcion: ['Consumo en restaurante'],
      referencia: ['ORD-' + Math.floor(Math.random() * 10000)]
    });
  }

  ngOnInit() {
    this.tiqueteraId = this.route.snapshot.paramMap.get('id') || '';
    if (this.tiqueteraId) {
      this.loadTiquetera();
      this.loadMovimientos();
    } else {
      this.router.navigate(['/cajero']);
    }
  }

  loadTiquetera() {
    // En un entorno real, usaríamos:
    // this.tiqueteraService.getTiqueteraById(this.tiqueteraId).subscribe(...)
    
    // Para desarrollo, usamos datos simulados
    this.tiquetera = this.tiqueteraService.getTiqueterasMock()
      .find(t => t.id === this.tiqueteraId) || null;
    
    this.loading = false;
  }

  loadMovimientos() {
    // En un entorno real, usaríamos:
    // this.tiqueteraService.getMovimientos(this.tiqueteraId).subscribe(...)
    
    // Para desarrollo, usamos datos simulados
    this.movimientos = this.tiqueteraService.getMovimientosMock(this.tiqueteraId);
  }

  segmentChanged(event: any) {
    this.activeTab = event.detail.value;
    this.consumoExitoso = false;
  }

  procesarConsumo() {
    if (this.consumoForm.invalid || !this.tiquetera) return;
    
    this.formLoading = true;
    const formData = this.consumoForm.value;
    
    // Verificar si hay saldo suficiente
    if (this.tiquetera.saldoDisponible < formData.monto) {
      this.errorMessage = 'Saldo insuficiente para realizar el consumo';
      this.formLoading = false;
      return;
    }
    
    // En un entorno real, usaríamos:
    // this.tiqueteraService.registrarConsumo(this.tiqueteraId, formData).subscribe(...)
    
    // Simulamos el registro de consumo
    setTimeout(() => {
      if (this.tiquetera) {
        // Añadir un nuevo movimiento al historial
        this.movimientos.unshift({
          id: 'temp-' + new Date().getTime(),
          tiquetera_id: this.tiqueteraId,
          tipo: 'consumo',
          monto: -formData.monto,
          saldoAnterior: this.tiquetera.saldoDisponible,
          saldoNuevo: this.tiquetera.saldoDisponible - formData.monto,
          descripcion: formData.descripcion,
          usuario_id: 'cajero-id',
          fecha: new Date()
        });
        
        // Actualizar saldo de la tiquetera
        this.tiquetera.saldoDisponible -= formData.monto;
        this.tiquetera.usados += formData.monto;
        
        // Verificar si se agotó el saldo
        if (this.tiquetera.saldoDisponible <= 0) {
          this.tiquetera.estado = 'agotada';
        }
      }
      
      this.formLoading = false;
      this.consumoExitoso = true;
      this.consumoForm.reset({
        monto: null,
        descripcion: 'Consumo en restaurante',
        referencia: 'ORD-' + Math.floor(Math.random() * 10000)
      });
    }, 1000);
  }

  volver() {
    this.router.navigate(['/cajero/buscar-tiquetera']);
  }

  nuevaBusqueda() {
    this.router.navigate(['/cajero/buscar-tiquetera']);
  }
} 