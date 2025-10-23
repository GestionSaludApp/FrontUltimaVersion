import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { NavegacionService } from '../../../servicios/navegacion.service';

@Component({
  selector: 'app-activacion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './activacion.component.html',
  styleUrl: './activacion.component.css'
})
export class ActivacionComponent {
  emailIngresado: string = '';
  advertenciaEmail: string = '';
  passwordIngresado: string = '';
  codigoIngresado: string = '';

  mensaje: string = '';

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

  activarUsuario(): boolean {
    if (this.verificarEmail() === false || this.passwordIngresado === '' || this.codigoIngresado === '') {
      this.advertenciaEmail = 'Por favor completa todos los campos.';
      return false;
    }

    this.baseDeDatos.activarUsuario(this.emailIngresado, this.passwordIngresado, this.codigoIngresado).subscribe({
      next: (respuesta) => {
        this.mensaje = 'Usuario activado correctamente.';
        this.navegar.irInicio();
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al activar el usuario.';
        this.limpiarCampos();
      }
    });
    return false;
  }

  limpiarCampos(){
    this.emailIngresado = '';
    this.passwordIngresado = '';
    this.codigoIngresado = '';
  }

}
