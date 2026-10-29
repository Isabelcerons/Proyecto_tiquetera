import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TiqueteraService, Tiquetera, MovimientoTiquetera } from '../../services/tiquetera.service';

@Component({
  selector: 'app-tiquetera-detalle',
  templateUrl: './tiquetera-detalle.component.html',
  styleUrls: ['./tiquetera-detalle.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule]
})
export class TiqueteraDetalleComponent implements OnInit {
  tiquetera: Tiquetera | null = null;
  movimientos: MovimientoTiquetera[] = [];
  tiqueteraId: string = '';
  loading = true;
  formLoading = false;
  tiqueteraForm: FormGroup;
  cargarSaldoForm: FormGroup;
  errorMessage = '';
  activeTab = 'info';

  constructor(
    private tiqueteraService: TiqueteraService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.tiqueteraForm = this.fb.group({
      activa: [true],
      fechaVencimiento: [null]
    });

    this.cargarSaldoForm = this.fb.group({
      monto: [null, [Validators.required, Validators.min(1)]],
      descripcion: ['']
    });
  }

  ngOnInit() {
    this.tiqueteraId = this.route.snapshot.paramMap.get('id') || '';
    if (this.tiqueteraId) {
      this.loadTiquetera();
      this.loadMovimientos();
    } else {
      this.router.navigate(['/admin/tiqueteras']);
    }
  }

  loadTiquetera() {
    // En un entorno real, usaríamos:
    // this.tiqueteraService.getTiqueteraById(this.tiqueteraId).subscribe(...)
    
    // Para desarrollo, usamos datos simulados
    this.tiquetera = this.tiqueteraService.getTiqueterasMock()
      .find(t => t.id === this.tiqueteraId) || null;
      
    if (this.tiquetera) {
      this.tiqueteraForm.patchValue({
        activa: this.tiquetera.activo,
        fechaVencimiento: this.tiquetera.fechaVencimiento
      });
    }
    
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
  }

  saveChanges() {
    if (this.tiqueteraForm.invalid) return;
    
    this.formLoading = true;
    const formData = this.tiqueteraForm.value;
    
    // En un entorno real, usaríamos:
    // this.tiqueteraService.updateTiquetera(this.tiqueteraId, formData).subscribe(...)
    
    // Simulamos actualización
    setTimeout(() => {
      if (this.tiquetera) {
        this.tiquetera.activo = formData.activa;
        this.tiquetera.fechaVencimiento = formData.fechaVencimiento;
        this.tiquetera.estado = formData.activa ? 'activa' : 'inactiva';
      }
      this.formLoading = false;
      // Mostrar mensaje de éxito
    }, 800);
  }

  cargarSaldo() {
    if (this.cargarSaldoForm.invalid) return;
    
    this.formLoading = true;
    const formData = this.cargarSaldoForm.value;
    
    // En un entorno real, usaríamos:
    // this.tiqueteraService.cargarSaldo(this.tiqueteraId, {
    //   monto: formData.monto,
    //   descripcion: formData.descripcion || 'Carga de saldo'
    // }).subscribe(...)
    
    // Simulamos carga de saldo
    setTimeout(() => {
      if (this.tiquetera) {
        // Añadir un nuevo movimiento al historial
        this.movimientos.unshift({
          id: 'temp-' + new Date().getTime(),
          tiquetera_id: this.tiqueteraId,
          tipo: 'carga',
          monto: formData.monto,
          saldoAnterior: this.tiquetera.saldoDisponible,
          saldoNuevo: this.tiquetera.saldoDisponible + formData.monto,
          descripcion: formData.descripcion || 'Carga de saldo',
          usuario_id: 'admin-id',
          fecha: new Date()
        });
        
        // Actualizar saldo de la tiquetera
        this.tiquetera.saldoDisponible += formData.monto;
        this.tiquetera.total_asignado += formData.monto;
      }
      
      this.formLoading = false;
      this.cargarSaldoForm.reset();
      // Mostrar mensaje de éxito
    }, 800);
  }

  volver() {
    this.router.navigate(['/admin/tiqueteras']);
  }
} 