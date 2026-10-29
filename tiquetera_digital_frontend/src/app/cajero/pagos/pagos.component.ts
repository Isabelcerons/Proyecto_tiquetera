import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

// Componente para gestión de pagos en el módulo de cajero
@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PagosComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() { }

  volver() {
    this.router.navigate(['/cajero']);
  }
} 