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
