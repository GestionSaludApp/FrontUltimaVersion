import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Especialidad } from '../../../clases/especialidad';
import { Perfil } from '../../../clases/perfil';
import { Seccional } from '../../../clases/seccional';
import { Turno } from '../../../clases/turno';
import { Usuario } from '../../../clases/usuario';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { nombresEspecialidades, nombresSeccionales } from '../../../funciones/listas';


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

  getTextoRol(p: any): string {
    switch (p.idPermisos) {
      case 1: return 'Paciente';
      case 2: return 'Profesional';
      case 3: return 'Administrador';
      default: return 'Desconocido';
    }
  }

  getCategoriaPerfil(p: any): string | number {
    if (p.idPermisos === 2) {
      return nombresEspecialidades[p.idEspecialidad];
    }

    if (p.idPermisos === 3) {
      return nombresSeccionales[p.idSeccional];
    }

    return p.categoria;
  }

  cambiarEstado(tabla: string, id: string | number, nuevoEstado: string) {
    console.log(tabla); console.log(id); console.log(nuevoEstado);
    this.baseDeDatos.cambiarEstado(tabla, id, nuevoEstado, () => {
      console.log(`Estado cambiado: ${tabla} - ID ${id} -> ${nuevoEstado}`);
    });
  }

}
