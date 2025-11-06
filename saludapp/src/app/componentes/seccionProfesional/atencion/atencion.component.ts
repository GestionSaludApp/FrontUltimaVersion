import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Turno } from '../../../clases/turno';
import { dias, leerMinutos } from '../../../funciones/fechas';
import { especialidades, seccionales } from '../../../funciones/listas';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { NuevoReporteComponent } from "../../nuevosElementos/nuevo-reporte/nuevo-reporte.component";

@Component({
  selector: 'app-atencion',
  standalone: true,
  imports: [NgFor, CommonModule, NuevoReporteComponent],
  templateUrl: './atencion.component.html',
  styleUrl: './atencion.component.css'
})
export class AtencionComponent implements OnInit{
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
          this.turnosActivos = turnos;
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

  obtenerFecha(diaSemana: number): Date {
    const hoy = new Date();
    const diferencia = (diaSemana + 7 - hoy.getDay()) % 7;
    const proximaFecha = new Date(hoy);
    proximaFecha.setDate(hoy.getDate() + diferencia);
    return proximaFecha;
  }

  finalizarTurno(turno: Turno) {
    // Lo quitamos de la lista
    this.turnosActivos = this.turnosActivos.filter(t => t.idTurno !== turno.idTurno);
    this.cerrarReporte();
  }
  
}