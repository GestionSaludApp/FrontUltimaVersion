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
  enviando = false;

  constructor(private baseDeDatos: BasededatosService) {}

  enviarEmail() {
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

        this.email = '';
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
}

