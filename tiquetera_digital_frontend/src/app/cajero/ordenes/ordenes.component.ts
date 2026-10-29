import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

// Componente para gestión de órdenes en el módulo de cajero
@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class OrdenesComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() { }

  volver() {
    this.router.navigate(['/cajero']);
  }
} 