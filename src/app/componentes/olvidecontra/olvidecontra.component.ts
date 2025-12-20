import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { BasededatosService } from '../../servicios/basededatos.service';
import { NavegacionService } from '../../servicios/navegacion.service';

@Component({
  selector: 'app-olvidecontra',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './olvidecontra.component.html',
  styleUrl: './olvidecontra.component.css'
})
export class OlvidecontraComponent {
  email: string = '';
  codigo: string = '';
  nuevaPassword: string = '';
  confirmarPassword: string = '';

  enviando = false;
  codigoEnviado = false; // 👈 NUEVO ESTADO

  constructor(private baseDeDatos: BasededatosService, private navegar: NavegacionService) {}

  enviarCodigo() {
    if (!this.email || this.enviando) return;

    this.enviando = true;

    this.baseDeDatos.reiniciarPassword(this.email).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '📩 Enlace enviado',
          text: `Si el email existe, te enviamos un enlace para restablecer tu contraseña.`,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0d6efd',
          width: '450px'
        });

        this.codigoEnviado = true;
        this.enviando = false;
      },
      error: (err) => {
        console.error('Error reiniciando contraseña', err);

        Swal.fire({
          icon: 'error',
          title: '❌ Error',
          text: 'No se pudo procesar la solicitud. Intentá nuevamente.',
          confirmButtonText: 'Aceptar'
        });

        this.enviando = false;
      }
    });
  }

  cambiarPassword() {
    if (!this.codigo || !this.nuevaPassword || !this.confirmarPassword) return;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!passwordRegex.test(this.nuevaPassword)) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ Atención',
        text: 'La contraseña debe tener al menos 8 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial.'
      });
      return;
    }

    const emailLower = this.email.toLowerCase();
    const passwordLower = this.nuevaPassword.toLowerCase();

    let contieneSecuenciaEmail = false;

    for (let i = 0; i <= emailLower.length - 3; i++) {
      const subcadena = emailLower.substring(i, i + 3);

      if (passwordLower.includes(subcadena)) {
        contieneSecuenciaEmail = true;
        break;
      }
    }

    if (contieneSecuenciaEmail) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ Atención',
        text: 'La contraseña no puede contener secuencias de 3 o más caracteres consecutivos de tu email.'
      });
      return;
    }

    if (this.nuevaPassword !== this.confirmarPassword) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ Atención',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    this.enviando = true;

    this.baseDeDatos
      .cambiarPassword(this.email, this.codigo, this.nuevaPassword)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '✅ Contraseña modificada',
            text: 'Tu contraseña fue actualizada correctamente.',
            confirmButtonText: 'Ir al inicio',
            confirmButtonColor: '#0d6efd'
          }).then(() => {
            this.irInicio();
          });

          // reset total del formulario
          this.email = '';
          this.codigo = '';
          this.nuevaPassword = '';
          this.confirmarPassword = '';
          this.codigoEnviado = false;
          this.enviando = false;
        },
        error: (err) => {
          console.error('Error cambiando contraseña', err);

          Swal.fire({
            icon: 'error',
            title: '❌ Error',
            text: err?.error?.error || 'No se pudo cambiar la contraseña. Verificá el código.'
          });

          this.enviando = false;
        }
      });
  }

  irInicio() {this.navegar.irInicio();}
}

