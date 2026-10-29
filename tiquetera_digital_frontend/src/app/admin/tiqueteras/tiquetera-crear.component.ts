import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, AlertController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { TiqueteraService } from '../../services/tiquetera.service';
import { AuthService, User } from '../../services/auth.service';
import { UserService, UserDTO } from '../../services/users.service';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-tiquetera-crear',
  templateUrl: './tiquetera-crear.component.html',
  styleUrls: ['./tiquetera-crear.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class TiqueteraCrearComponent implements OnInit {
  tiqueteraForm: FormGroup;
  userForm: FormGroup;
  searchControl = new FormControl('');
  
  loading = false;
  showUserForm = false;
  errorMessage = '';
  usuarios: User[] = []; // Lista de usuarios con rol 'cliente'
  filteredUsuarios: User[] = [];
  searching = false;
  selectedClienteNombre: string = '';

  constructor(
    private tiqueteraService: TiqueteraService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.tiqueteraForm = this.fb.group({
      cliente_id: ['', Validators.required],
      cantidadTickets: [30, [Validators.required, Validators.min(1)]],
      fechaVencimiento: [null],
      price: [225000, [Validators.required, Validators.min(1)]]
    });

    this.userForm = this.fb.group({
      nombre: ['', {
        validators: [Validators.required],
        asyncValidators: [this.nombreDisponibleValidator.bind(this)],
        updateOn: 'change'
      }],
      usuario: ['', {
        validators: [Validators.required],
        asyncValidators: [this.usuarioDisponibleValidator.bind(this)],
        updateOn: 'change'
      }],
      contrasena: ['', Validators.required],
      cedula: ['', Validators.required],
      pin: ['', {
        validators: [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
        asyncValidators: [this.pinDisponibleValidator.bind(this)],
        updateOn: 'change'
      }]
    });
  }

  ngOnInit() {
    this.loadClientes();
    
    // Configurar el control de búsqueda
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.searchUsers(value);
        } else {
          this.filteredUsuarios = [];
        }
      });
  }

  loadClientes() {
    this.loading = true;
    console.log('Cargando clientes desde el backend...');
    
    // Cargar usuarios con rol 'cliente' desde el backend
    this.userService.getByRole('cliente')
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (usuarios) => {
          console.log('Clientes cargados exitosamente:', usuarios);
          this.usuarios = usuarios;
          this.filteredUsuarios = [];
        },
        error: (error) => {
          console.error('Error al cargar clientes:', error);
          console.error('Status:', error.status);
          console.error('Mensaje:', error.message);
          console.error('Error completo:', error);
          // En caso de error, cargar datos simulados como respaldo
          this.usuarios = this.userService.getClientesMock();
          this.showErrorToast('Error al cargar clientes. Usando datos locales.');
        }
      });
  }

  nombreDisponibleValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || !control.value.trim()) {
      return of(null);
    }
    return this.userService.checkNombreExists(control.value.trim()).pipe(
      map(exists => exists ? { nombreOcupado: true } : null),
      first()
    );
  }

  usuarioDisponibleValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || !control.value.trim()) {
      return of(null);
    }
    return this.userService.checkUsernameExists(control.value.trim()).pipe(
      map(exists => exists ? { usuarioOcupado: true } : null),
      first()
    );
  }

  pinDisponibleValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || !control.value.trim()) {
      return of(null);
    }
    return this.userService.checkPinExists(control.value.trim()).pipe(
      map(exists => exists ? { pinOcupado: true } : null),
      first()
    );
  }

  searchUsers(query: string) {
    if (!query || query.trim() === '') {
      this.filteredUsuarios = [];
      return;
    }
    this.searching = true;
    this.userService.searchByName(query)
      .pipe(
        finalize(() => this.searching = false),
        map(users => users.filter(u => u.nombre?.toLowerCase().includes(query.toLowerCase())))
      )
      .subscribe({
        next: (usuarios) => {
          this.filteredUsuarios = usuarios;
        },
        error: (error) => {
          this.filteredUsuarios = this.userService.searchByNameMock(query);
          this.showErrorToast('Error en la búsqueda. Mostrando resultados locales.');
        }
      });
  }

  selectUser(user: User) {
    this.tiqueteraForm.patchValue({ cliente_id: user.id });
    this.selectedClienteNombre = user.nombre;
    this.filteredUsuarios = [];
    this.searchControl.setValue(user.nombre, { emitEvent: false });
  }

  toggleUserForm() {
    this.showUserForm = !this.showUserForm;
    if (!this.showUserForm) {
      this.userForm.reset();
    }
  }

  async createUser() {
    if (this.userForm.invalid) return;
    this.loading = true;
    const userData = {
      nombre: this.userForm.value.nombre,
      usuario: this.userForm.value.usuario,
      contrasena: this.userForm.value.contrasena,
      cedula: this.userForm.value.cedula,
      pin: this.userForm.value.pin,
      // rol y activo no son necesarios, el backend lo fuerza a cliente
    };
    this.userService.create(userData)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (nuevoUsuario) => {
          this.usuarios = [...this.usuarios, nuevoUsuario];
          this.tiqueteraForm.patchValue({ cliente_id: nuevoUsuario.id });
          this.showUserForm = false;
          this.userForm.reset();
          this.toastCtrl.create({
            message: 'Usuario creado exitosamente',
            duration: 2000,
            color: 'success'
          }).then(toast => toast.present());
        },
        error: async (error) => {
          console.error('Error al crear usuario:', error);
          let mensajeError = 'Error al crear usuario';
          if (error.error?.message) {
            mensajeError = error.error.message;
          }
          this.alertCtrl.create({
            header: 'Error',
            message: mensajeError,
            buttons: ['OK']
          }).then(alert => alert.present());
        }
      });
  }

  createTiquetera() {
    if (this.tiqueteraForm.invalid) return;
    
    this.loading = true;
    const formData = {
      cliente_id: this.tiqueteraForm.value.cliente_id,
      nombreCliente: this.selectedClienteNombre,
      saldoInicial: this.tiqueteraForm.value.cantidadTickets, // Mapeamos cantidadTickets a saldoInicial
      fechaVencimiento: this.tiqueteraForm.value.fechaVencimiento,
      price: this.tiqueteraForm.value.price
    };
    
    // Crear tiquetera en el backend
    this.tiqueteraService.createTiquetera(formData)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (tiquetera) => {
          // Mostrar mensaje de éxito
          this.toastCtrl.create({
            message: `Tiquetera creada exitosamente con ${formData.saldoInicial} tickets`,
            duration: 2000,
            color: 'success'
          }).then(toast => toast.present());
          
          this.router.navigate(['/admin/tiqueteras']);
        },
        error: (error) => {
          console.error('Error al crear tiquetera:', error);
          let mensajeError = 'Error al crear la tiquetera';
          if (error.error?.message) {
            mensajeError = error.error.message;
          }
          
          this.alertCtrl.create({
            header: 'Error',
            message: mensajeError,
            buttons: ['OK']
          }).then(alert => alert.present());
        }
      });
  }

  async showErrorToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: 'warning'
    });
    toast.present();
  }

  volver() {
    this.router.navigate(['/admin/tiqueteras']);
  }
} 