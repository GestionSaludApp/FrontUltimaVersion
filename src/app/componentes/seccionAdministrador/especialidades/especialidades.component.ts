import { Component, OnInit, OnDestroy } from '@angular/core';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { especialidades } from '../../../funciones/listas';
import { NgFor, NgIf } from '@angular/common';
import { Especialidad } from '../../../clases/especialidad';
import { Subscription } from 'rxjs';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { Perfil } from '../../../clases/perfil';
import { NuevaEspecialidadComponent } from "../../nuevosElementos/nueva-especialidad/nueva-especialidad.component";
import { FormsModule } from '@angular/forms';
import { prefijoImagen } from '../../../credenciales/datos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NuevaEspecialidadComponent,
    FormsModule
  ],
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent implements OnInit, OnDestroy {
  especialidadesLocal: Especialidad[] = [];
  prefijoImagen = prefijoImagen;
  private perfilSubscripcion: Subscription | null = null;
  perfilActivo: Perfil | null = null;
  
  mostrarPanelNueva: boolean = false;
  especialidadEditada: Especialidad = new Especialidad();
  mostrarPanelEditar: boolean[] = [];

  constructor(private usuarioActivo: UsuarioActivoService, private baseDeDatos: BasededatosService) {}

  ngOnInit(): void {
    this.perfilSubscripcion = this.usuarioActivo.perfilObservable$.subscribe(perfil => {
      this.perfilActivo = perfil;
      console.log('Perfil activo:', this.perfilActivo);
    });
    this.baseDeDatos.buscarEspecialidades(() => {
       this.especialidadesLocal = especialidades.filter(esp => esp.idEspecialidad !== 0).map(esp => {
        return { ...esp};
      });
      
      this.mostrarPanelEditar = this.especialidadesLocal.map(() => false);
    });
  }

  ngOnDestroy(): void {
    this.perfilSubscripcion?.unsubscribe();
  }

  mostrarPanelNuevaEspecialidad() {
    this.mostrarPanelNueva = !this.mostrarPanelNueva;
  }

  mostrarPanelEditarEspecialidad(index: number) {
    this.especialidadEditada = this.especialidadesLocal[index];
    const estabaAbierto = this.mostrarPanelEditar[index];
    this.mostrarPanelEditar = this.mostrarPanelEditar.map((_, i) => i === index && !estabaAbierto);
  }

  exportarCSV() {
    const csvContent = this.generarCSV(this.especialidadesLocal);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'especialidades_disponibles.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: '¡Exportación completa!',
      text: 'Los datos se exportaron correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd'
    });
  }

  generarCSV(especialidades: Especialidad[]): string {
    const headers = 'Especialidad;Duracion\n';
    const rows = especialidades.map(e => `${this.eliminarTildes(e.nombre)};${e.duracion} minutos`);
    return headers + rows.join('\n');
  }

  eliminarTildes(palabra: string): string {
    return palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  eliminarEspecialidad(especialidad: Especialidad) {
    this.baseDeDatos.eliminarEspecialidad(this.usuarioActivo.idUsuario, especialidad).subscribe({
      next: res => console.log('Especialidad eliminada:', res),
      error: err => console.error('Error al eliminar:', err)
    });
  }

  editarEspecialidad() {
    this.baseDeDatos.editarEspecialidad(this.usuarioActivo.idUsuario, this.especialidadEditada).subscribe({
      next: resp => {
        console.log('Especialidad actualizada', resp);
        this.cerrarPaneles();
      },
      error: err => console.error('Error al actualizar', err)
    });
  }

  cerrarPaneles() {
    this.mostrarPanelNueva = false;
    this.mostrarPanelEditar = this.mostrarPanelEditar.map(() => false);
  }

  imagen(index: number): string{
      return this.prefijoImagen+this.especialidadesLocal[index].imagen;
  }
}