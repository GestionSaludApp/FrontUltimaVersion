import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Reporte } from '../../../clases/reporte';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { BasededatosService } from '../../../servicios/basededatos.service';
import  Swal  from 'sweetalert2';

@Component({
  selector: 'app-nuevo-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nuevo-reporte.component.html',
  styleUrls: ['./nuevo-reporte.component.css']
})
export class NuevoReporteComponent {
  @Input() idPerfilPaciente!: number;
  @Input() idPerfilProfesional!: number;
  @Input() idTurno!: string; 
  @Output() cerrar = new EventEmitter<void>();

  imagenSeleccionada: File | null = null;
  nuevoReporte: Reporte = new Reporte();

  constructor(private usuarioActivo: UsuarioActivoService, private baseDeDatos: BasededatosService) {}

  ngOnInit() {
    this.nuevoReporte.idPerfilPaciente = this.idPerfilPaciente;
    this.nuevoReporte.idPerfilProfesional = this.idPerfilProfesional;
    this.nuevoReporte.idTurno = this.idTurno;
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.imagenSeleccionada = event.target.files[0];
    }
  }
  @Output() reporteGuardado = new EventEmitter<void>();

  guardarReporte(): void {
    this.baseDeDatos.agregarReporte(this.usuarioActivo.idUsuario, this.nuevoReporte, this.imagenSeleccionada).subscribe({
      next: () => {
        Swal.fire({
          title: 'Reporte guardado',
          text: 'El turno fue finalizado correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
  
        this.reporteGuardado.emit(); // 👈 notifica al padre
        this.cerrar.emit(); // cierra el modal
      },
      error: (error) => {
        console.error('Error al guardar reporte:', error);
      }
    });
    this.cerrar.emit();
  }
}