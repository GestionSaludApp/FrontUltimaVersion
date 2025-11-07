import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BasededatosService } from '../../servicios/basededatos.service';
import { NavegacionService } from '../../servicios/navegacion.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.css'
})
export class IngresoComponent {

  emailIngresado: string = '';
  advertenciaEmail: string = '';
  passwordIngresado: string = '';

  showPassword: boolean = false;

  constructor(private baseDeDatos: BasededatosService, private navegar: NavegacionService) {}

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

  limpiarCampos(){
    this.emailIngresado = '';
    this.passwordIngresado = '';
  }

  ingresar() {
    if (this.verificarEmail() === true) {
      this.baseDeDatos.ingresarUsuario(this.emailIngresado, this.passwordIngresado).subscribe({
        next: (respuesta: any) => {
          // Suponiendo que la API te devuelve los datos del usuario (como nombre o email)
          const nombreUsuario = respuesta?.nombre || this.emailIngresado;
  
          this.limpiarCampos();
  
          // SweetAlert de bienvenida
          Swal.fire({
            title: `¡Bienvenido, ${nombreUsuario}! 👋`,
            text: 'Has iniciado sesión correctamente.',
            icon: 'success',
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#0d6efd',
            timer: 2500,
            timerProgressBar: true
          });
  
          // Redirigir al inicio
          this.navegar.irInicio();
        },
        error: () => {
          Swal.fire({
            title: 'Error al iniciar sesión',
            text: 'No se pudo completar el ingreso. Verifica los datos e intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#dc3545'
          });
          this.limpiarCampos();
        }
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
