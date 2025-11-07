import { Component } from '@angular/core';
import { rolesUsuario } from '../../funciones/listas';
import { NgFor, NgIf } from '@angular/common';
import { BasededatosService } from '../../servicios/basededatos.service';
import { Usuario } from '../../clases/usuario';
import { fechaAhora } from '../../funciones/fechas';
import { NavegacionService } from '../../servicios/navegacion.service';
import { NuevoPacienteComponent } from "../nuevosElementos/nuevo-paciente/nuevo-paciente.component";
import { NuevoProfesionalComponent } from "../nuevosElementos/nuevo-profesional/nuevo-profesional.component";
import { NuevoAdministradorComponent } from "../nuevosElementos/nuevo-administrador/nuevo-administrador.component";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NuevoPacienteComponent, NuevoProfesionalComponent, NuevoAdministradorComponent, NgIf, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  rolesUsuarioLocal = rolesUsuario;

  emailIngresado: string = '';
  advertenciaEmail: string = '';

  passwordIngresado: string = '';
  advertenciaPassword: string = '';

  passwordConfirmacionIngresado: string = '';
  advertenciaConfirmacionPassword: string = '';

  rolSeleccionado: 'paciente' | 'profesional' | 'administrador' = 'paciente';
  imagenSeleccionada: File | null = null;

  datosUsuario: any = {};
  camposPorRol: Record<string, string[]> = {
    paciente: ['nombre', 'apellido', 'dni', 'fechaNacimiento'],
    profesional: ['nombre', 'apellido', 'dni', 'fechaNacimiento', 'idEspecialidad', 'disponibilidad'],
    administrador: ['nombre', 'apellido', 'dni', 'fechaNacimiento']
  };

  constructor(private baseDeDatos: BasededatosService, private navegar: NavegacionService) {}
  
  registrarUsuario() {
    console.log("Llegó a registro de usuario");
  
    if (
      this.verificarDatosIngresados() &&
      this.verificarDatosUsuarioEmitidos(this.rolSeleccionado, this.datosUsuario)
    ) {
      let nuevoUsuario = new Usuario();
      nuevoUsuario.email = this.emailIngresado;
      nuevoUsuario.password = this.passwordIngresado;
      nuevoUsuario.fechaCreacion = fechaAhora;
      nuevoUsuario.ultimoIngreso = fechaAhora;
  
      this.baseDeDatos.registrarUsuario(nuevoUsuario, this.datosUsuario, this.imagenSeleccionada)
        .subscribe({
          next: () => {
            this.limpiarCampos();
  
            // SweetAlert de éxito
            Swal.fire({
              title: '¡Usuario registrado con éxito! 🎉',
              text: 'Tu cuenta fue creada correctamente. Ya puedes iniciar sesión.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#0d6efd'
            });
  
            this.navegar.irInicio();
          },
          error: () => {
            this.limpiarCampos();
  
            // SweetAlert de error
            Swal.fire({
              title: 'Error al registrar usuario',
              text: 'No se pudo completar el registro. Verifica los datos e intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Cerrar',
              confirmButtonColor: '#dc3545'
            });
          }
        });
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.imagenSeleccionada = event.target.files[0];
    }
  }

  verificarDatosIngresados(): boolean {
    if (this.verificarEmail() && this.verificarPassword()) {return true}
    return false
  }

  verificarDatosUsuarioEmitidos(rol: string, datos: any): boolean {
    const camposRequeridos = this.camposPorRol[rol] || [];
    return camposRequeridos.every(campo => datos[campo]?.toString().trim());
  }

  verificarEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let textoAdvertencia = '';
    let verificado = true;

    if (this.emailIngresado.trim() === '' || !emailRegex.test(this.emailIngresado)) {
      textoAdvertencia = 'El correo electrónico debe tener un formato válido (ej: texto@correo.com).';
      verificado = false;
    }

    this.advertenciaEmail = textoAdvertencia;
    return verificado;
  }

  verificarPassword() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    let textoAdvertencia = '';
    let textoAdvertenciaConfirmacion = '';
    let verificado = true;

    if (!passwordRegex.test(this.passwordIngresado)) {
      textoAdvertencia = 'La contraseña debe tener al menos 8 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial.';
      verificado = false;
    }

    if(this.passwordIngresado != this.passwordConfirmacionIngresado) {
      textoAdvertenciaConfirmacion = 'Las contraseñas no coinciden.';
      verificado = false;
    }

    this.advertenciaPassword = textoAdvertencia;
    this.advertenciaConfirmacionPassword = textoAdvertenciaConfirmacion;
    return verificado;

  }

  guardarDatosUsuario(datos: any) {
    this.datosUsuario = datos;
  }

  limpiarCampos(){
    this.emailIngresado = '';
    this.advertenciaEmail = '';
  
    this.passwordIngresado = '';
    this.advertenciaPassword = '';
  
    this.passwordConfirmacionIngresado = '';
    this.advertenciaConfirmacionPassword = '';
  
    this.rolSeleccionado = 'paciente';
    this.datosUsuario = {};
  }

}
