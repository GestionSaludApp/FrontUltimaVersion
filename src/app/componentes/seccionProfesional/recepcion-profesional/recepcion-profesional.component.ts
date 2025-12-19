import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Turno } from '../../../clases/turno';
import { dias, leerMinutos } from '../../../funciones/fechas';
import { especialidades, seccionales } from '../../../funciones/listas';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { NuevoReporteComponent } from "../../nuevosElementos/nuevo-reporte/nuevo-reporte.component";

@Component({
  selector: 'app-recepcion-profesional',
  standalone: true,
  imports: [CommonModule, NgFor, NuevoReporteComponent],
  templateUrl: './recepcion-profesional.component.html',
  styleUrl: './recepcion-profesional.component.css'
})
export class RecepcionProfesionalComponent implements OnInit{
  turnosActivos: Turno[] = [];
  turnoSeleccionado: Turno | null = null;
  diasLocal = dias;
  seccionalesLocal = seccionales;
  especialidadesLocal = especialidades;

  constructor(private usuarioActual: UsuarioActivoService, private baseDeDatos: BasededatosService){}

  ngOnInit(): void {
    if (this.usuarioActual.perfil) {
      this.buscarTurnos();
    }
    this.baseDeDatos.buscarEspecialidades(() => {
      this.especialidadesLocal = especialidades.slice(1);
    });
    this.baseDeDatos.buscarSeccionales(() => {
      this.seccionalesLocal = seccionales.slice(1);
    });
  }

  buscarTurnos(){
    const filtros: any = {};

    if (this.usuarioActual.perfil) {
      filtros.idPerfil = this.usuarioActual.perfil.idPerfil;
      this.baseDeDatos.buscarTurnosActivos(filtros).subscribe({
        next: (turnos: Turno[]) => {
          this.turnosActivos = turnos.filter(
            t => (t as any).situacion === 'esperando'
          );
        },
        error: (error) => {
          console.error('Error al cargar turnos:', error);
        }
      }); 
    }
  }

  terminarTurno(turno: Turno) {
    let idPacienteTemp = (turno as any).idPerfilPaciente;
    let idProfesionalTemp = (turno as any).idPerfilProfesional;
    this.turnoSeleccionado = turno;
    this.turnoSeleccionado.idPaciente = idPacienteTemp;
    this.turnoSeleccionado.idProfesional = idProfesionalTemp;
  }

  cerrarReporte() {
    this.turnoSeleccionado = null;
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