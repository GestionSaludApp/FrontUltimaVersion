import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { Perfil } from '../../../clases/perfil';
import { Subscription } from 'rxjs';
import { Reporte } from '../../../clases/reporte';
import { CommonModule } from '@angular/common';
import { prefijoImagen } from '../../../credenciales/datos';

@Component({
  selector: 'app-ver-historia-clinica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-historia-clinica.component.html',
  styleUrl: './ver-historia-clinica.component.css'
})

export class VerHistoriaClinicaComponent implements OnInit, OnDestroy {
  reportesLocal: Reporte[] = [];
  perfilActivo: Perfil | null = null;
  prefijoImagen = prefijoImagen;
  private perfilSubscripcion: Subscription | null = null;

  constructor(
    private usuarioActivo: UsuarioActivoService,
    private baseDeDatos: BasededatosService
  ) {}

  ngOnInit(): void {
    // suscribirse al perfil activo
    this.perfilSubscripcion = this.usuarioActivo.perfilObservable$.subscribe(perfil => {
      this.perfilActivo = perfil;

      // si ya tenemos un idPaciente, pedimos los reportes
      if (perfil && perfil.idPerfil) {
        this.cargarReportes(perfil.idPerfil);
      }
    });
  }

  cargarReportes(idPaciente: number): void {
    this.baseDeDatos.buscarReportes(idPaciente).subscribe({
      next: (reportes: Reporte[]) => {
        this.reportesLocal = reportes;
        //console.log('Reportes cargados:', this.reportesLocal);
      },
      error: (err) => {
        console.error('Error al obtener reportes:', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.perfilSubscripcion) {
      this.perfilSubscripcion.unsubscribe();
    }
  }

  imagen(imagenReporte: string): string{
    return this.prefijoImagen+imagenReporte;
  }

}