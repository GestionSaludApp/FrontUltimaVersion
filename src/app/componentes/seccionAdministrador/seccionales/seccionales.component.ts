import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NuevaSeccionalComponent } from "../../nuevosElementos/nueva-seccional/nueva-seccional.component";
import { NgFor, NgIf } from '@angular/common';
import { Seccional } from '../../../clases/seccional';
import { Subscription } from 'rxjs';
import { Perfil } from '../../../clases/perfil';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { seccionales } from '../../../funciones/listas';
import { prefijoImagen } from '../../../credenciales/datos';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seccionales',
  standalone: true,
  imports: [NgFor, NgIf, NuevaSeccionalComponent, FormsModule],
  templateUrl: './seccionales.component.html',
  styleUrl: './seccionales.component.css'
})

/*
export class SeccionalesComponent implements OnInit{
  seccionalesLocal: Seccional[] = [];
  prefijoImagen = prefijoImagen;
  private perfilSubscripcion: Subscription | null = null;
  perfilActivo: Perfil | null = null;
  
  mostrarPanelNueva: boolean = false;
  seccionalEditada: Seccional = new Seccional();
  mostrarPanelEditar: boolean[] = [];

  constructor(private usuarioActivo: UsuarioActivoService, private baseDeDatos: BasededatosService) {}

  ngOnInit(): void {
    this.perfilSubscripcion = this.usuarioActivo.perfilObservable$.subscribe(perfil => {
      this.perfilActivo = perfil;
    });
    this.baseDeDatos.buscarSeccionales(() => {
      this.seccionalesLocal = seccionales.slice(1);
    });
  }

  ngOnDestroy(): void {
    if (this.perfilSubscripcion) {
      this.perfilSubscripcion.unsubscribe();
    }
  }

  mostrarPanelNuevaSeccional(){
    this.mostrarPanelNueva = !this.mostrarPanelNueva;
  }

  mostrarPanelEditarSeccional(index: number) {
    this.cerrarPaneles();
    this.seccionalEditada = this.seccionalesLocal[index];
    var estabaAbierto = this.mostrarPanelEditar[index];
    if (estabaAbierto) {
      this.mostrarPanelEditar[index] = false;
    } else {
      this.mostrarPanelEditar = this.mostrarPanelEditar.map((_, i) => i === index);
    }
  }

  editarSeccional() {
    this.baseDeDatos.editarSeccional(this.usuarioActivo.idUsuario, this.seccionalEditada).subscribe({
      next: (resp) => {
        console.log('Seccional actualizada', resp);
        this.cerrarPaneles();
      },
      error: (err) => {
        console.error('Error al actualizar', err);
      },
    });
  }

  cerrarPaneles(){
    this.mostrarPanelNueva = false;
    for (let i = 0; i < this.mostrarPanelEditar.length; i++){
      this.mostrarPanelEditar[i] = false;
    }
  }

  */

 export class SeccionalesComponent implements OnInit, OnDestroy {

  seccionalesLocal: Seccional[] = [];

  private perfilSubscripcion: Subscription | null = null;
  perfilActivo: Perfil | null = null;

  mostrarPanelNueva = false;
  seccionalEditada: Seccional = new Seccional();
  mostrarPanelEditar: boolean[] = [];

  constructor(
    private usuarioActivo: UsuarioActivoService,
    private baseDeDatos: BasededatosService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.perfilSubscripcion = this.usuarioActivo.perfilObservable$.subscribe(perfil => {
      this.perfilActivo = perfil;
    });

    // Cuando cargas las seccionales, inicializá también el array de flags
    this.baseDeDatos.buscarSeccionales(() => {
    this.seccionalesLocal = seccionales.filter(s => s.idSeccional !== 0).map(s => {
      let imagen = '';
  
      switch (s.nombre.trim()) {
        case 'Avellaneda Centro':
          imagen = '/seccionales/seccional1.jpg';
          break;
        case 'Ituzaingó Centro':
          imagen = '/seccionales/seccional2.jpg';
          break;
        case 'La Plata':
          imagen = '/seccionales/seccional3.jpg';
          break;
        case 'Lomas de Zamora':
          imagen = '/seccionales/seccional4.png';
          break;
        case 'Moron':
          imagen = '/seccionales/seccional5.jpg';
          break;
        case 'Quilmes':
          imagen = '/seccionales/seccional6.jpg';
          break;
        default:
          imagen = '/seccionales/default.jpg';
      }
  
      return { ...s, imagen };
    });
  
    this.mostrarPanelEditar = new Array(this.seccionalesLocal.length).fill(false);
    try { this.cd.detectChanges(); } catch (e) {}
  });

  }

  ngOnDestroy(): void {
    if (this.perfilSubscripcion) {
      this.perfilSubscripcion.unsubscribe();
    }
  }

  mostrarPanelNuevaSeccional() {
    this.mostrarPanelNueva = !this.mostrarPanelNueva;
  }

  mostrarPanelEditarSeccional(index: number) {
    const abrir = !this.mostrarPanelEditar[index];
    this.mostrarPanelEditar.fill(false);
    this.mostrarPanelEditar[index] = abrir;
    this.seccionalEditada = { ...this.seccionalesLocal[index] };
  }

  editarSeccional() {
    const idx = this.seccionalesLocal.findIndex(s => s.nombre === this.seccionalEditada.nombre);
    if (idx !== -1) {
      this.seccionalesLocal[idx] = { ...this.seccionalEditada };
    }
    this.cerrarPaneles();
  }

  cerrarPaneles() {
    this.mostrarPanelNueva = false;
    this.mostrarPanelEditar.fill(false);
  }

  eliminarSeccional(seccional: Seccional){
    this.baseDeDatos.eliminarSeccional(this.usuarioActivo.idUsuario, seccional).subscribe({
      next: (res) => {
        console.log('Seccional eliminada:', res);
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
      }
    });      
  }

  exportarCSV() {
    const csvContent = this.generarCSV(this.seccionalesLocal);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'seccionales_disponibles.csv');
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
  
    generarCSV(seccionales: Seccional[]): string {
    const headers = 'Seccional; Direccion, Ciudad, Provincia, Telefono, Email\n';
    const rows = seccionales.map(seccional => {
      return `
        ${this.eliminarTildes(seccional.nombre)};
        ${this.eliminarTildes(seccional.direccion)};
        ${this.eliminarTildes(seccional.ciudad)};
        ${this.eliminarTildes(seccional.provincia)};
        ${seccional.telefono};
        ${seccional.email}`;
    });

    return headers + rows.join('\n');
  }

   eliminarTildes(palabra: string): string {
    let nuevaPalabra = '';

    for (let letra of palabra) {
        if (letra === 'á') {
            nuevaPalabra += 'a';
        } else if (letra === 'é') {
            nuevaPalabra += 'e';
        } else if (letra === 'í') {
            nuevaPalabra += 'i';
        } else if (letra === 'ó') {
            nuevaPalabra += 'o';
        } else if (letra === 'ú') {
            nuevaPalabra += 'u';
        } else {
            nuevaPalabra += letra;
        }
    }
    return nuevaPalabra;
  }
  /*
  modalAbierto = false;
  seccionalSeleccionada: Seccional | null = null;

  abrirModal(seccional: Seccional) {
    this.seccionalSeleccionada = seccional;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.seccionalSeleccionada = null;
  }*/
}