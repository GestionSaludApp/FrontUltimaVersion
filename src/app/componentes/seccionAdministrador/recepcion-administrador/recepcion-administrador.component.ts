import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Turno } from '../../../clases/turno';
import { dias, fechaAhora, leerMinutos } from '../../../funciones/fechas';
import { especialidades, seccionales } from '../../../funciones/listas';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { BasededatosService } from '../../../servicios/basededatos.service';

@Component({
  selector: 'app-recepcion-administrador',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './recepcion-administrador.component.html',
  styleUrl: './recepcion-administrador.component.css'
})
export class RecepcionAdministradorComponent implements OnInit{
  turnosActivos: Turno[] = [];
  turnoSeleccionado: Turno | null = null;
  diasLocal = dias;
  seccionalesLocal = seccionales;
  especialidadesLocal = especialidades;

  constructor(private usuarioActual: UsuarioActivoService, private baseDeDatos: BasededatosService){}

  ngOnInit(): void {
    if (this.usuarioActual.perfil) {
      this.cargarTurnosActivos();
    }
    this.baseDeDatos.buscarEspecialidades(() => {
      this.especialidadesLocal = especialidades.slice(1);
    });
    this.baseDeDatos.buscarSeccionales(() => {
      this.seccionalesLocal = seccionales.slice(1);
    });
  }

  cargarTurnosActivos(): void {
    this.baseDeDatos.obtenerTurnosActivos().subscribe({
      next: (turnos: Turno[]) => {
        this.turnosActivos = turnos.filter(t =>
          t.situacion === '' &&
          this.verFecha(t.idTurno) === fechaAhora.split(',')[0]
        );
      },
      error: (err) => {
        console.error('Error al obtener turnos activos', err);
      }
    });
  }

  habilitarTurno(turno: Turno) {
    this.baseDeDatos
      .actualizarSituacionTurno(turno.idTurno, 'esperando')
      .subscribe({
        next: () => {
          // Opcional: sacarlo de la lista en pantalla
          this.turnosActivos = this.turnosActivos.filter(
            t => t.idTurno !== turno.idTurno
          );
        },
        error: err => {
          console.error('Error al habilitar turno', err);
        }
      });
  }

  terminarTurno(turno: Turno) {
    this.baseDeDatos
      .actualizarSituacionTurno(turno.idTurno, 'abandonado')
      .subscribe({
        next: () => {
          // Opcional: sacarlo de la lista en pantalla
          this.turnosActivos = this.turnosActivos.filter(
            t => t.idTurno !== turno.idTurno
          );
        },
        error: err => {
          console.error('Error al habilitar turno', err);
        }
      });
  }

  leerMinutos(minutos: number){
    return leerMinutos(minutos);
  }

  verFecha(codigo: string): string {
    const match = codigo.match(/d(\d{2})(\d{2})(\d{4})/);

    if (!match) {
      return '';
    }

    const dia = match[1];
    const mes = match[2];
    const anio = match[3];

    let fecha = `${dia}/${mes}/${anio}`;
    return fecha;
  }

}