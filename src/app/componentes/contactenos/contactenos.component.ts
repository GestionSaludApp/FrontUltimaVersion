/*
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { BasededatosService } from '../../servicios/basededatos.service';

@Component({
  selector: 'app-contactenos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css']
})
export class ContactenosComponent {
  //ver que anda mal
  private apiUrl = 'http://localhost:3000/envio';

  constructor(private baseDeDatos: BasededatosService) {}

  enviarFormulario(formulario: NgForm) {
    if (formulario.invalid) {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor completá todos los campos antes de enviar.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#f0ad4e'
      });
      return;
    }
    // Obtenemos los datos del form
    const datos = formulario.value;

    this.http.post(this.apiUrl, datos).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: '¡Mensaje enviado!',
          text: 'Gracias por tu consulta. Nos pondremos en contacto pronto.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0d6efd'
        });
        formulario.reset();
      },
      error: (err) => {
        console.error('Error al enviar mensaje:', err);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al enviar tu mensaje. Intentá de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}
*/

import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BasededatosService } from '../../servicios/basededatos.service';

@Component({
  selector: 'app-contactenos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contactenos.component.html',
  styleUrl: './contactenos.component.css'
})
export class ContactenosComponent {

  enviando = false;
  enviadoOk = false;
  errorEnvio = '';

  constructor(private baseDeDatos: BasededatosService) {}

  enviarFormulario(form: NgForm) {
    if (form.invalid || this.enviando) {
      return;
    }

    const { nombre, email, mensaje } = form.value;

    this.enviando = true;
    this.errorEnvio = '';
    this.enviadoOk = false;

    this.baseDeDatos.enviarConsulta(nombre, email, mensaje).subscribe({
      next: () => {
        this.enviadoOk = true;
        form.resetForm();
      },
      error: (err) => {
        console.error('Error al enviar consulta', err);
        this.errorEnvio = 'No se pudo enviar la consulta. Intente más tarde.';
      },
      complete: () => {
        this.enviando = false;
      }
    });
  }
}
