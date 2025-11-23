import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-olvidecontra',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './olvidecontra.component.html',
  styleUrl: './olvidecontra.component.css'
})
export class OlvidecontraComponent {
  email: string = '';

  enviarEmail() {
    if (!this.email) return;

    // Aquí luego se conectará la API para enviar el email
    Swal.fire({
      icon: 'success',
      title: '✅ Enlace enviado!',
      text: `Hemos enviado un enlace de restablecimiento a ${this.email}`,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd',
      width: '450px',
      padding: '2rem',
      position: 'center',
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });

    // Limpiar input después de enviar
    this.email = '';
  }
}
