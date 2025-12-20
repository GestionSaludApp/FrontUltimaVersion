import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { BasededatosService } from '../../servicios/basededatos.service';

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

  constructor(private baseDeDatos: BasededatosService) {}

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

    if (this.nuevaPassword !== this.confirmarPassword) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ Atención',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    // 👉 acá luego llamaremos a la API cambiarPassword
    console.log('Cambiar password', {
      email: this.email,
      codigo: this.codigo,
      nuevaPassword: this.nuevaPassword
    });
  }

}

