import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.createForms();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  createForms() {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get usuarioError(): string | null {
    const control = this.loginForm.get('usuario');
    if (control?.touched && control?.hasError('required')) {
      return 'El usuario es requerido';
    }
    return null;
  }

  get contrasenaError(): string | null {
    const control = this.loginForm.get('contrasena');
    if (control?.touched) {
      if (control.hasError('required')) {
        return 'La contraseña es requerida';
      }
      if (control.hasError('minlength')) {
        return 'La contraseña debe tener al menos 6 caracteres';
      }
    }
    return null;
  }

  async onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const usuario = this.loginForm.get('usuario')?.value.trim();
    const contrasena = this.loginForm.get('contrasena')?.value;

    // Verificar usuarios de prueba
    if (await this.checkTestUsers(usuario, contrasena)) {
      return;
    }

    // Esperar a que el storage esté listo antes de continuar
    if ((this.authService as any).storageReady === false) {
      if (this.authService.initStorage) {
        await this.authService.initStorage();
      }
    }

    this.loading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'circles'
    });
    await loading.present();

    this.authService.login({ usuario, contrasena }).subscribe({
      next: () => {
        loading.dismiss();
        this.loading = false;
        this.redirectBasedOnRole();
      },
      error: async (error) => {
        loading.dismiss();
        this.loading = false;
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: error.error?.message || 'Error al iniciar sesión',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  // Verificar usuarios de prueba
  async checkTestUsers(username: string, password: string): Promise<boolean> {
    if (username === 'admin' && password === 'admin123') {
      await this.authService.loginMockUser({
        id: 'admin-id',
        username: 'admin',
        nombre: 'Administrador',
        rol: 'admin'
      });
      this.redirectBasedOnRole();
      return true;
    } 
    else if (username === 'mesero' && password === 'mesero123') {
      await this.authService.loginMockUser({
        id: 'mesero-id',
        username: 'mesero',
        nombre: 'Mesero Prueba',
        rol: 'mesero'
      });
      this.redirectBasedOnRole();
      return true;
    }
    else if (username === 'cajero' && password === 'cajero123') {
      await this.authService.loginMockUser({
        id: 'cajero-id',
        username: 'cajero',
        nombre: 'Cajero Prueba',
        rol: 'cajero'
      });
      this.redirectBasedOnRole();
      return true;
    }
    else if (username === 'cliente' && password === 'cliente123') {
      await this.authService.loginMockUser({
        id: 'cliente-id',
        username: 'cliente',
        nombre: 'Cliente Prueba',
        rol: 'cliente'
      });
      this.redirectBasedOnRole();
      return true;
    }
    return false;
  }

  // Redirigir según el rol
  redirectBasedOnRole() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    switch (user.rol) {
      case 'admin':
        this.router.navigateByUrl('/admin', { replaceUrl: true });
        break;
      case 'mesero':
        this.router.navigateByUrl('/mesero', { replaceUrl: true });
        break;
      case 'cajero':
        this.router.navigateByUrl('/cajero', { replaceUrl: true });
        break;
      case 'cliente':
        this.router.navigateByUrl('/cliente', { replaceUrl: true });
        break;
      default:
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }
  }

  async forgotPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Recuperar Contraseña',
      message: 'Por favor contacte al administrador del sistema para resetear su contraseña.',
      buttons: ['Entendido']
    });
    await alert.present();
  }
} 