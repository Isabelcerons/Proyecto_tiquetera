import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService, UserDTO } from '../../services/users.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-busqueda-modal',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Tiquetera</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">Nombre completo</ion-label>
        <ion-input [(ngModel)]="busquedaNombre" (ionInput)="buscarPorNombre()"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">PIN</ion-label>
        <ion-input [(ngModel)]="busquedaPin" (ionInput)="buscarPorPin()"></ion-input>
      </ion-item>
      <ion-list *ngIf="resultados.length > 0">
        <ion-item *ngFor="let cliente of resultados" (click)="seleccionar(cliente)" button>
          <ion-label>{{ cliente.pin ? cliente.pin + ' ' : '' }}{{ cliente.nombre }}</ion-label>
        </ion-item>
      </ion-list>
      <ion-item *ngIf="mensajeError">
        <ion-label color="danger">{{ mensajeError }}</ion-label>
      </ion-item>
      <div class="ion-padding-top ion-text-center">
        <ion-button expand="block" color="primary" (click)="seleccionarEfectivo()">Efectivo</ion-button>
      </div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClienteBusquedaModal {
  @Input() indice: number = 0;
  busquedaNombre: string = '';
  busquedaPin: string = '';
  resultados: UserDTO[] = [];
  mensajeError: string = '';

  constructor(private modalCtrl: ModalController, private userService: UserService) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }

  buscarPorNombre() {
    this.mensajeError = '';
    if (!this.busquedaNombre || this.busquedaNombre.length < 3) {
      this.resultados = [];
      return;
    }
    this.userService.searchByName(this.busquedaNombre).subscribe({
      next: (clientes) => {
        this.resultados = clientes.filter(c => c.rol === 'cliente').map(c => ({
          id: c.id,
          nombre: c.nombre,
          usuario: c.username || '',
          contrasena: '',
          cedula: '',
          pin: '',
          activo: true
        }));
        if (this.resultados.length === 0) {
          this.mensajeError = 'No se encontraron clientes con ese nombre';
        }
      },
      error: () => {
        this.resultados = [];
        this.mensajeError = 'Error en la búsqueda';
      }
    });
  }

  buscarPorPin() {
    this.mensajeError = '';
    if (!this.busquedaPin || this.busquedaPin.length < 4) {
      this.resultados = [];
      return;
    }
    this.userService.findByPin(this.busquedaPin).subscribe({
      next: (cliente) => {
        this.resultados = cliente ? [cliente] : [];
        if (!cliente) {
          this.mensajeError = 'No se encontró cliente con ese PIN';
        }
      },
      error: () => {
        this.resultados = [];
        this.mensajeError = 'Error en la búsqueda';
      }
    });
  }

  seleccionar(cliente: UserDTO) {
    this.modalCtrl.dismiss({ cliente: { ...cliente, metodoPago: 'tiquetera' }, indice: this.indice });
  }

  seleccionarEfectivo() {
    this.modalCtrl.dismiss({ cliente: { metodoPago: 'efectivo' }, indice: this.indice });
  }
} 