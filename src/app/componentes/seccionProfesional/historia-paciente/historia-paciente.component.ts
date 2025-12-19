import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { Perfil } from '../../../clases/perfil';
import { Subscription } from 'rxjs';
import { Reporte } from '../../../clases/reporte';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { prefijoImagen } from '../../../credenciales/datos';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historia-paciente',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule],
  templateUrl: './historia-paciente.component.html',
  styleUrl: './historia-paciente.component.css'
})
export class HistoriaPacienteComponent implements OnInit, OnDestroy {
  reportesLocal: Reporte[] = [];
  perfilActivo: Perfil | null = null;
  prefijoImagen = prefijoImagen;
  idPacienteManual: number | null = null;

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
      if (perfil && perfil.idPerfil && !this.idPacienteManual) {
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

  buscarPacienteManual(): void {
    if (!this.idPacienteManual) {
      return;
    }
    this.cargarReportes(this.idPacienteManual);
  }

}