import { Component, OnInit } from '@angular/core';
import { UsuarioActivoService } from '../../servicios/usuario-activo.service';
import { NavegacionService } from '../../servicios/navegacion.service';
import { Perfil } from '../../clases/perfil';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{  
  private perfilSubscripcion: Subscription | null = null;
  perfilActivo: Perfil | null = null;

  constructor(private usuarioActual: UsuarioActivoService, private navegar: NavegacionService) {}

  ngOnInit(): void {
    this.perfilSubscripcion = this.usuarioActual.perfilObservable$.subscribe(perfil => {
      this.perfilActivo = perfil;
    });
  }

  ngOnDestroy(): void {
    if (this.perfilSubscripcion) {
      this.perfilSubscripcion.unsubscribe();
    }
  }

  //subBarra
  activeTab: string = 'datosPersonales';

  irDatosPersonales() {
    this.activeTab = 'datosPersonales';
    this.navegar.irDatosPersonales();
  }

  irTurnosDisponibles() {
    this.activeTab = 'turnosDisponibles';
    this.navegar.irTurnosDisponibles();
  }

  irTurnosAtencion(){
    this.activeTab = 'turnosAtencion';
    this.navegar.irTurnosAtencion();
  }

  irClientes() {
    this.activeTab = 'clientes';
    this.navegar.irClientes();  
  }

  irPersonal() {
    this.activeTab = 'personal';
    this.navegar.irPersonal();
  }

  irHabilitaciones() {
    this.activeTab = 'habilitaciones';
    this.navegar.irHabilitaciones();
  }


}
