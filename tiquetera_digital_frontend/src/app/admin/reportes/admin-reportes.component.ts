import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-reportes',
  templateUrl: './admin-reportes.component.html',
  styleUrls: ['./admin-reportes.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AdminReportesComponent implements OnInit {
  loading = true;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = false;
  }

  volver() {
    this.router.navigate(['/admin']);
  }
} 