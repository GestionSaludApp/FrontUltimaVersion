import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { Perfil } from '../../../clases/perfil';
import { Subscription } from 'rxjs';
import { Reporte } from '../../../clases/reporte';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-historia-clinica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-historia-clinica.component.html',
  styleUrls: ['./ver-historia-clinica.component.css']
})
export class VerHistoriaClinicaComponent implements OnInit, OnDestroy {
  reportesLocal: Reporte[] = [];
  perfilActivo: Perfil | null = null;
  cargando: boolean = true; //para mostrar el spinner (solo es visual)
  private perfilSubscripcion: Subscription | null = null;

  constructor(
    private usuarioActivo: UsuarioActivoService,
    private baseDeDatos: BasededatosService
  ) {}

  ngOnInit(): void {
    this.perfilSubscripcion = this.usuarioActivo.perfilObservable$.subscribe(perfil => {
      this.perfilActivo = perfil;

      if (perfil?.idPerfil) {
        this.cargarReportes(perfil.idPerfil);
      } else {
        this.cargando = false;
        this.reportesLocal = [];
      }
    });
  }

  cargarReportes(idPaciente: number): void {
    this.cargando = true;
    this.baseDeDatos.buscarReportes(idPaciente).subscribe({
      next: (reportes: Reporte[]) => {
        this.reportesLocal = reportes;
        this.cargando = false;
        console.log('Reportes cargados:', this.reportesLocal);
      },
      error: (err) => {
        console.error('Error al obtener reportes:', err);
        this.cargando = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.perfilSubscripcion?.unsubscribe();
  }
}