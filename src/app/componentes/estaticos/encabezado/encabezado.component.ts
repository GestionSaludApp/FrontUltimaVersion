import { Component, OnInit } from '@angular/core';
import { NavegacionService } from '../../../servicios/navegacion.service';
import { Subscription } from 'rxjs';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { Perfil } from '../../../clases/perfil';
import { NavbarComponent } from "../../../shared/navbar/navbar.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [NgIf, NavbarComponent],
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.css'
})
export class EncabezadoComponent implements OnInit{
  
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
  
  irAyuda(){this.navegar.irAyuda();}
  irInicio(){this.navegar.irInicio();}
  irIngreso(){this.navegar.irIngreso();}
  irError(){this.navegar.irError();}
  irRegistro(){this.navegar.irRegistro();}
  irEspecialidades(){this.navegar.irEspecialidades();}
  irSeccionales(){this.navegar.irSeccionales();}

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
