import { Component, OnInit } from '@angular/core';
import { categoriasPerfil } from '../../../funciones/listas';
import { FormsModule } from '@angular/forms';
import { NuevoPacienteComponent } from "../nuevo-paciente/nuevo-paciente.component";
import { NuevoProfesionalComponent } from "../nuevo-profesional/nuevo-profesional.component";
import { NuevoAdministradorComponent } from "../nuevo-administrador/nuevo-administrador.component";
import { NgFor, NgIf } from '@angular/common';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { NavegacionService } from '../../../servicios/navegacion.service';
import Swal from 'sweetalert2'; 
import { Perfil } from '../../../clases/perfil';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nuevo-perfil',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, NuevoPacienteComponent, NuevoProfesionalComponent, NuevoAdministradorComponent],
  templateUrl: './nuevo-perfil.component.html',
  styleUrl: './nuevo-perfil.component.css'
})

export class NuevoPerfilComponent implements OnInit {

  private perfilSubscripcion: Subscription | null = null;
  perfilActivo: Perfil | null = null;

  datosPerfil: any = {};
  categoriasPerfilLocal = categoriasPerfil;
  categoriaNuevoPerfil: string = 'categoría';
  posiblesPerfiles: string[] = [];
  perfilNuevoSeleccionado: string | null = null;
  mostrarFormularioNuevoPerfil: boolean = false;

  constructor(private baseDeDatos: BasededatosService, private usuarioActivo: UsuarioActivoService, private navegar: NavegacionService) {}
  
  ngOnInit(): void {
    this.perfilSubscripcion = this.usuarioActivo.perfilObservable$.subscribe(perfil => {
      this.perfilActivo = perfil;
    });
    if (this.perfilActivo?.rol === 'administrador') {
      this.posiblesPerfiles = ['paciente', 'profesional', 'administrador'];
    } else if (this.perfilActivo?.rol === 'profesional') {
      this.posiblesPerfiles = ['paciente', 'profesional'];
    } else if (this.perfilActivo?.rol === 'paciente') {
      this.posiblesPerfiles = ['paciente'];
    } else {
      this.posiblesPerfiles = [];
    }
  }

  guardarDatosUsuario(datos: any) {this.datosPerfil = datos;}

  guardarNuevoPerfil(){
    this.baseDeDatos.registrarPerfilAdicional(this.usuarioActivo.idUsuario, this.datosPerfil).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Usuario registrado!',
          text: 'El registro se realizó con éxito.',
          icon: 'success',
          timer: 2000,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0d6efd'
        }).then(() => {
          this.limpiarFormulario();
          this.navegar.irDatosPersonales();
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo completar el registro. Verifique los datos e intente nuevamente.',
          icon: 'error',
          timer: 2000,
          confirmButtonText: 'Reintentar',
          confirmButtonColor: '#dc3545'
        }).then(() => {
          this.limpiarFormulario();
        });
      }
    });
  }

  reiniciarFormulario() {
    this.mostrarFormularioNuevoPerfil = false;
    setTimeout(() => this.mostrarFormularioNuevoPerfil = true, 10);
  }

  limpiarFormulario(){
    this.perfilNuevoSeleccionado = null;
    this.mostrarFormularioNuevoPerfil = false;
  }

}
