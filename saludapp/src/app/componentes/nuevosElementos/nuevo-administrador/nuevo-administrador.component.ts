import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { formatearFechaSinHora } from '../../../funciones/fechas';
import { categoriasPerfil } from '../../../funciones/listas';

@Component({
  selector: 'app-nuevo-administrador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nuevo-administrador.component.html',
  styleUrl: './nuevo-administrador.component.css'
})
export class NuevoAdministradorComponent {
  @Input() categoria: string = categoriasPerfil[0];
  
  nombreIngresado: string = '';
  apellidoIngresado: string = '';
  advertenciaNombres: string = '';
  dniIngresado: string = '';
  advertenciaDNI: string = '';
  fechaNacimientoIngresada: string = '';

  @Output() datosGenerados = new EventEmitter<any>();
  
  emitirDatos() {
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumerosRegex = /^[0-9]+$/;
    let textoAdvertenciaNombres = '';
    let textoAdvertenciaDNI = '';
    let verificado: boolean = true;
  
    if (!soloLetrasRegex.test(this.nombreIngresado) || !soloLetrasRegex.test(this.apellidoIngresado)) {
      textoAdvertenciaNombres = 'Nombre inválido: solo debe contener letras y espacios.';
      verificado = false;
    }
  
    if (!soloNumerosRegex.test(this.dniIngresado)) {
      textoAdvertenciaDNI = 'DNI inválido: debe contener solo números.';
      verificado = false;
    }

    this.advertenciaNombres = textoAdvertenciaNombres;
    this.advertenciaDNI = textoAdvertenciaDNI;
    
    const fechaFormateada = formatearFechaSinHora(this.fechaNacimientoIngresada);

    if (verificado) {
      this.datosGenerados.emit({
        rol: 'administrador',
        categoria: this.categoria,
        alias: this.nombreIngresado.trim() + ' (' + this.categoria + ')',

        nombre: this.nombreIngresado.trim(),
        apellido: this.apellidoIngresado.trim(),
        dni: this.dniIngresado.trim(),
        fechaNacimiento: fechaFormateada
      });
    } else {
      this.datosGenerados.emit({})
    }
  }
}
