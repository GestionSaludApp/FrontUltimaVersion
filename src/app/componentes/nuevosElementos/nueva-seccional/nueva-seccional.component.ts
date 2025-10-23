import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seccional } from '../../../clases/seccional';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';

@Component({
  selector: 'app-nueva-seccional',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nueva-seccional.component.html',
  styleUrl: './nueva-seccional.component.css'
})
export class NuevaSeccionalComponent {
  seccional: Seccional = new Seccional();
  imagenSeleccionada: File | null = null;

  constructor(private usuarioActivo: UsuarioActivoService, private baseDeDatos: BasededatosService) {}

  guardarSeccional() {
    this.baseDeDatos.agregarSeccional(this.usuarioActivo.idUsuario, this.seccional, this.imagenSeleccionada).subscribe({
      next: (res) => {
        console.log('Seccional guardada:', res);
        this.seccional = new Seccional();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
      }
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.imagenSeleccionada = event.target.files[0];
    }
  }

}
