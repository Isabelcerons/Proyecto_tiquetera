import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MesaService, Mesa } from '../../services/mesa.service';
import { EstadoService, Estado } from '../../services/estado.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-mesas',
  templateUrl: './admin-mesas.component.html',
  styleUrls: ['./admin-mesas.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule]
})
export class AdminMesasComponent implements OnInit {
  mesas: Mesa[] = [];
  filteredMesas: Mesa[] = [];
  loading = true;
  filtroEstadoId: number | null = null;
  filtroZona: string = '';
  zonas: string[] = [];
  showForm = false;
  editMode = false;
  mesaForm: FormGroup;
  mesaEditId: string | null = null;
  estados: Estado[] = [];

  constructor(
    private mesaService: MesaService,
    private estadoService: EstadoService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.mesaForm = this.fb.group({
      numero: ['', Validators.required],
      capacidad: ['', Validators.required],
      zona: ['', Validators.required],
      estado: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadEstados();
    this.loadMesas();
  }

  loadEstados() {
    this.estadoService.getEstados().subscribe(estados => {
      this.estados = estados;
    });
  }

  loadMesas() {
    this.loading = true;
    this.mesaService.getMesas().subscribe({
      next: (mesas) => {
        this.mesas = mesas;
        this.zonas = [...new Set(this.mesas.map(mesa => mesa.zona))];
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.mesas = [];
        this.zonas = [];
        this.applyFilters();
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let mesas = [...this.mesas];
    if (this.filtroEstadoId) {
      mesas = mesas.filter(mesa => mesa.estado.id === this.filtroEstadoId);
    }
    if (this.filtroZona) {
      mesas = mesas.filter(mesa => mesa.zona === this.filtroZona);
    }
    mesas.sort((a, b) => a.numero - b.numero);
    this.filteredMesas = mesas;
  }

  resetFilters() {
    this.filtroEstadoId = null;
    this.filtroZona = '';
    this.applyFilters();
  }

  async presentMesaForm(mesa?: Mesa) {
    this.showForm = true;
    this.editMode = !!mesa;
    if (mesa) {
      this.mesaEditId = mesa.id;
      this.mesaForm.setValue({
        numero: mesa.numero ?? '',
        capacidad: mesa.capacidad ?? '',
        zona: mesa.zona ?? '',
        estado: mesa.estado?.id ?? null
      });
    } else {
      const disponible = this.estados.find(e => e.nombre === 'disponible');
      this.mesaEditId = null;
      this.mesaForm.reset({ estado: disponible?.id || null });
    }
  }

  cancelarForm() {
    this.showForm = false;
    this.mesaEditId = null;
    this.mesaForm.reset({ estado: null });
  }

  guardarMesa() {
    if (this.mesaForm.invalid) {
      this.presentToast('Todos los campos son obligatorios', 'danger');
      return;
    }
    const data = this.mesaForm.value;
    const request = this.editMode
      ? this.mesaService.updateMesa(this.mesaEditId!, data)
      : this.mesaService.createMesa(data);

    request.subscribe({
      next: () => {
        this.presentToast(`Mesa ${this.editMode ? 'actualizada' : 'creada'} correctamente`, 'success');
        this.showForm = false;
        this.loadMesas();
      },
      error: () => this.presentToast('Error al guardar la mesa', 'danger')
    });
  }

  async confirmDeleteMesa(mesa: Mesa) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro que desea eliminar la mesa ${mesa.numero}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteMesa(mesa.id);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteMesa(id: string) {
    this.mesaService.deleteMesa(id).subscribe({
      next: () => {
        this.presentToast('Mesa eliminada correctamente', 'success');
        this.loadMesas();
      },
      error: () => {
        this.presentToast('Error al eliminar la mesa', 'danger');
      }
    });
  }

  getEstadoColor(estado: Estado): string {
    switch (estado.nombre) {
      case 'disponible': return 'success';
      case 'ocupada': return 'danger';
      case 'reservada': return 'warning';
      default: return 'medium';
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    
    await toast.present();
  }

  volver() {
    this.router.navigate(['/admin']);
  }
} 