import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MesaService, Mesa } from '../../services/mesa.service';
import { ProductoService, Producto } from '../../services/producto.service';
import { OrdenService } from '../../services/orden.service';
import { UserService, UserDTO } from '../../services/users.service';
import { AuthService, User } from '../../services/auth.service';
import { TiqueteraService, Tiquetera } from '../../services/tiquetera.service';
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personCircleOutline, closeCircle } from 'ionicons/icons';
import { ClienteBusquedaModal } from './cliente-busqueda.modal';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.page.html',
  styleUrls: ['./orden.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OrdenPage implements OnInit {
  mesaId: string = '';
  mesa: Mesa | null = null;
  cliente: UserDTO | null = null;
  productos: Producto[] = [];
  productosSeleccionados: { producto: Producto, cantidad: number }[] = [];
  metodoPago: string = '';
  tipoOrden: string = '';
  busquedaCliente: string = '';
  busquedaPin: string = '';
  resultadosClientes: UserDTO[] = [];
  resultadosProductos: Producto[] = [];
  loading = true;
  busquedaProducto: string = '';
  mesero: User | null = null;
  tiqueteraActiva: Tiquetera | null = null;
  mensajePinNoEncontrado: string = '';
  resultadoPinCliente: string = '';
  clientePorPin: UserDTO | null = null;
  cantidadClientes: number = 1;
  clientesSeleccionados: ({ nombre?: string; id?: string; metodoPago: string; pin?: string } | null)[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mesaService: MesaService,
    private productoService: ProductoService,
    private ordenService: OrdenService,
    private userService: UserService,
    private authService: AuthService,
    private tiqueteraService: TiqueteraService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {
    addIcons({
      'person-circle-outline': personCircleOutline,
      'close-circle': closeCircle
    });
  }

  ngOnInit() {
    this.mesaId = this.route.snapshot.paramMap.get('id') || '';
    this.cargarMesa();
    this.cargarProductos();
    this.mesero = this.authService.getCurrentUser();
    this.actualizarClientesSeleccionados();
  }

  actualizarClientesSeleccionados() {
    const nuevos: ({ nombre?: string; id?: string; metodoPago: string; pin?: string } | null)[] = [];
    for (let i = 0; i < this.cantidadClientes; i++) {
      nuevos[i] = this.clientesSeleccionados[i] || null;
    }
    this.clientesSeleccionados = nuevos;
  }

  cargarMesa() {
    this.mesaService.getMesaById(this.mesaId).subscribe({
      next: (mesa) => { this.mesa = mesa; },
      error: () => { this.mesa = null; }
    });
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (productos) => { this.productos = productos; },
      error: () => { this.productos = this.productoService.getProductosMock(); }
    });
  }

  buscarClientePorNombre(nombre: string) {
    if (!nombre || nombre.length < 3) {
      this.resultadosClientes = [];
      return;
    }
    this.userService.searchByName(nombre).subscribe({
      next: (clientes) => {
        this.resultadosClientes = clientes.filter(c => c.rol === 'cliente').map(c => ({
          id: c.id,
          nombre: c.nombre,
          usuario: c.username,
          contrasena: '',
          activo: true
        }));
        if (this.resultadosClientes.length === 1 && this.resultadosClientes[0].nombre.toLowerCase() === nombre.toLowerCase()) {
          this.seleccionarCliente(this.resultadosClientes[0]);
        }
      },
      error: () => {
        this.resultadosClientes = this.userService.searchByNameMock(nombre).map(c => ({
          id: c.id,
          nombre: c.nombre,
          usuario: c.username,
          contrasena: '',
          activo: true
        }));
      }
    });
  }

  buscarClientePorPin(pin: string) {
    this.mensajePinNoEncontrado = '';
    this.resultadoPinCliente = '';
    this.clientePorPin = null;
    if (!pin || pin.length < 4) {
      this.resultadosClientes = [];
      return;
    }
    this.userService.searchByPin(pin).subscribe({
      next: (resultado) => {
        if (typeof resultado === 'string') {
          this.resultadoPinCliente = resultado;
          // Buscar el usuario real por pin para selección
          this.userService.findByPin(pin).subscribe({
            next: (user) => { this.clientePorPin = user; },
            error: () => { this.clientePorPin = null; }
          });
        } else {
          this.resultadoPinCliente = '';
          this.mensajePinNoEncontrado = 'No se encontró cliente con ese PIN';
        }
      },
      error: () => {
        this.resultadoPinCliente = '';
        this.mensajePinNoEncontrado = 'No se encontró cliente con ese PIN';
      }
    });
  }

  seleccionarCliente(cliente: UserDTO, origen: 'nombre' | 'pin' = 'nombre') {
    this.cliente = cliente;
    this.resultadosClientes = [];
    if (origen === 'nombre') {
      this.busquedaCliente = cliente.nombre;
      this.busquedaPin = '';
    } else {
      this.busquedaCliente = '';
      this.busquedaPin = cliente.pin ? `${cliente.pin} ${cliente.nombre}` : cliente.nombre;
    }
    this.mensajePinNoEncontrado = '';
  }

  limpiarClienteSeleccionado() {
    this.cliente = null;
    this.busquedaCliente = '';
    this.busquedaPin = '';
    this.mensajePinNoEncontrado = '';
    this.clientePorPin = null;
    this.resultadoPinCliente = '';
  }

  buscarProductoPorNombre(nombre: string) {
    if (!nombre || nombre.length < 2) {
      this.resultadosProductos = [];
      return;
    }
    this.resultadosProductos = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  agregarProducto(producto: Producto) {
    const existente = this.productosSeleccionados.find(p => p.producto.id === producto.id);
    if (existente) {
      existente.cantidad++;
    } else {
      this.productosSeleccionados.push({ producto, cantidad: 1 });
    }
    this.resultadosProductos = [];
    this.busquedaProducto = '';
  }

  quitarProducto(producto: Producto) {
    const idx = this.productosSeleccionados.findIndex(p => p.producto.id === producto.id);
    if (idx > -1) {
      if (this.productosSeleccionados[idx].cantidad > 1) {
        this.productosSeleccionados[idx].cantidad--;
      } else {
        this.productosSeleccionados.splice(idx, 1);
      }
    }
  }

  crearOrden() {
    const clienteSeleccionado = this.clientesSeleccionados.find(c => c);
    if (!this.mesa || !clienteSeleccionado || !this.mesero || this.productosSeleccionados.length === 0) {
      this.mostrarToast('Completa todos los campos', 'warning');
      return;
    }
    // Solo asignar this.cliente si es un cliente real (tiene id y nombre)
    if (clienteSeleccionado.id && clienteSeleccionado.nombre) {
      this.cliente = clienteSeleccionado as any; // UserDTO
    } else {
      this.cliente = null;
    }
    this.metodoPago = clienteSeleccionado.metodoPago;
    if (this.metodoPago === 'tiquetera' && clienteSeleccionado.id) {
      this.tiqueteraService.getTiqueterasByCliente(clienteSeleccionado.id).subscribe({
        next: (tiqueteras) => {
          const activa = tiqueteras.find(t => t.activo && t.estado === 'activa');
          if (!activa) {
            this.mostrarToast('El cliente no tiene tiquetera activa', 'danger');
            return;
          }
          this.tiqueteraActiva = activa;
          this.procesarCreacionOrden(clienteSeleccionado.id);
        },
        error: () => {
          this.mostrarToast('Error al buscar la tiquetera', 'danger');
        }
      });
    } else {
      this.procesarCreacionOrden(clienteSeleccionado.id || null);
    }
  }

  procesarCreacionOrden(clienteId: string | null = null) {
    const items = this.productosSeleccionados.map(p => ({
      productoId: p.producto.id,
      nombre: p.producto.nombre,
      cantidad: p.cantidad,
      precio: p.producto.precio,
      subtotal: p.producto.precio * p.cantidad,
      estado: 'pendiente'
    }));
    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const ordenData: any = {
      mesa_id: this.mesaId,
      mesero_id: this.mesero?.id,
      cliente_id: clienteId,
      estado: 'abierta',
      items,
      subtotal,
      impuestos: 0,
      total: subtotal,
      metodo_pago: this.metodoPago,
      tiquetera_id: this.tiqueteraActiva ? this.tiqueteraActiva.id : undefined
    };
    this.ordenService.createOrden(ordenData).subscribe({
      next: (orden) => {
        this.mostrarToast('Orden creada correctamente', 'success');
        this.router.navigate(['/mesero/mesas']);
      },
      error: () => {
        this.mostrarToast('Error al crear la orden', 'danger');
      }
    });
  }

  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color
    });
    toast.present();
  }

  volver() {
    this.router.navigate(['/mesero/mesas']);
  }

  async abrirBusquedaCliente(indice: number) {
    const modal = await this.modalCtrl.create({
      component: ClienteBusquedaModal,
      componentProps: { indice }
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && data.cliente != null && typeof data.indice === 'number') {
      this.clientesSeleccionados[data.indice] = data.cliente;
    }
  }

  getOpcionesCantidadClientes(): number[] {
    if (!this.mesa || !this.mesa.capacidad) return [1];
    return Array.from({ length: this.mesa.capacidad }, (_, i) => i + 1);
  }
} 