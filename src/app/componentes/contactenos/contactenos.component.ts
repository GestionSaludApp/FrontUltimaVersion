import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contactenos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css']
})
export class ContactenosComponent {

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

    // Guardamos en localStorage (simulación de “consulta registrada”)
    let consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
    consultas.push({
      nombre: datos.nombre,
      email: datos.email,
      mensaje: datos.mensaje,
      fecha: new Date().toLocaleString()
    });
    localStorage.setItem('consultas', JSON.stringify(consultas));

    // SweetAlert de éxito
    Swal.fire({
      title: '¡Mensaje enviado!',
      text: 'Gracias por tu consulta. Nos pondremos en contacto pronto.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd'
    });

    // Limpiamos el formulario
    formulario.reset();
  }
}