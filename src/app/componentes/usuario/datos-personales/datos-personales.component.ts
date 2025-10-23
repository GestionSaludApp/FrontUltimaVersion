import { Component, OnInit } from '@angular/core';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { especialidades, seccionales } from '../../../funciones/listas';
import { dias } from '../../../funciones/fechas';
import { Perfil, Profesional } from '../../../clases/perfil';
import { FormsModule } from '@angular/forms';
import { NuevoPerfilComponent } from "../../nuevosElementos/nuevo-perfil/nuevo-perfil.component";
import { prefijoImagen } from '../../../credenciales/datos';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { Disponibilidad } from '../../../clases/disponibilidad';
import { Especialidad } from '../../../clases/especialidad';
import { Seccional } from '../../../clases/seccional';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, NuevoPerfilComponent],
  templateUrl: './datos-personales.component.html',
  styleUrl: './datos-personales.component.css'
})
export class DatosPersonalesComponent implements OnInit{
  especialidadesLocal: Especialidad[] = [];
  seccionalesLocal: Seccional[] = [];
  dias = dias;
  avatarGenerico = "v1756774763/perfiles/cthtfwco3ir2bwwpbyih.png"

  private perfilSubscripcion: Subscription | null = null;
  perfilActivo: Perfil | null = null;
  perfilesUsuario: Perfil[] = [];
  perfilSeleccionado: Perfil = new Perfil();
  prefijoImagen = prefijoImagen;
  
  constructor(private usuarioActual: UsuarioActivoService, private baseDeDatos: BasededatosService) {}

  ngOnInit(): void {
    this.perfilSubscripcion = this.usuarioActual.perfilObservable$.subscribe(perfil => {
      this.perfilActivo = perfil;
    });
    this.perfilesUsuario = this.usuarioActual.obtenerPerfiles();
    this.baseDeDatos.buscarEspecialidades(() => {
      this.especialidadesLocal = especialidades;
    });
    this.baseDeDatos.buscarSeccionales(() => {
      this.seccionalesLocal = seccionales;
    });
  }

  ngOnDestroy(): void {
    if (this.perfilSubscripcion) {
      this.perfilSubscripcion.unsubscribe();
    }
  }

  especialidad(): string | null{
    if(this.perfilActivo instanceof Profesional){
      return this.especialidadesLocal[this.perfilActivo.idEspecialidad].nombre;
    }
    return null
  }

  cronograma(): Disponibilidad[] | null{
      if(this.perfilActivo instanceof Profesional){
      return this.perfilActivo.disponibilidad;
    }
    return null
  }

  seccional(idSeccional: number): string {
    return this.seccionalesLocal[idSeccional].nombre;
  }

  avatar(): string{
    if(this.perfilActivo?.imagen){
      return this.prefijoImagen+this.perfilActivo.imagen;
    }
    return this.prefijoImagen+this.avatarGenerico;
  }

  cambiarPerfil(){
    this.baseDeDatos.ingresarPerfil(this.usuarioActual.idUsuario,this.perfilSeleccionado.idPerfil).subscribe();
  }

}