import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Turno } from '../../../clases/turno';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { dias, leerMinutos } from '../../../funciones/fechas';
import { especialidades, seccionales } from '../../../funciones/listas';

@Component({
  selector: 'app-ver-turnos-activos',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './ver-turnos-activos.component.html',
  styleUrl: './ver-turnos-activos.component.css'
})
export class VerTurnosActivosComponent implements OnInit{
  turnosActivos: Turno[] = [];
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

  leerMinutos(minutos: number){
    return leerMinutos(minutos);
  }

  cancelarTurno(turno: Turno){
    
  }

}
