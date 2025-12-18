import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Especialidad } from '../../../clases/especialidad';
import { Perfil } from '../../../clases/perfil';
import { Seccional } from '../../../clases/seccional';
import { Turno } from '../../../clases/turno';
import { Usuario } from '../../../clases/usuario';
import { BasededatosService } from '../../../servicios/basededatos.service';


@Component({
  selector: 'app-habilitaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habilitaciones.component.html',
  styleUrl: './habilitaciones.component.css'
})
export class HabilitacionesComponent implements OnInit {

  especialidadesPendientes: Especialidad[] = [];
  perfilesPendientes: Perfil[] = [];
  seccionalesPendientes: Seccional[] = [];
  turnosPendientes: Turno[] = [];
  usuarioPerfilesPendientes: Perfil[] = [];
  usuariosPendientes: Usuario[] = [];

  constructor(private baseDeDatos: BasededatosService) {}

  ngOnInit() {
    this.cargarPendientes();
  }

  cargarPendientes() {
    this.baseDeDatos.buscarPendientes((pendientes) => {
      this.especialidadesPendientes = pendientes.especialidades;
      this.perfilesPendientes = pendientes.perfiles;
      this.seccionalesPendientes = pendientes.seccionales;
      this.turnosPendientes = pendientes.turnos;
      this.usuarioPerfilesPendientes = pendientes.usuarioPerfiles;
      this.usuariosPendientes = pendientes.usuarios;
    });
  }

  cambiarEstado(registro: any, nuevoEstado: string) {
    // IMPLEMENTACIÓN MÁS ADELANTE
    console.log(registro, nuevoEstado);
  }
}
