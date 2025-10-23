import { Component, OnInit } from '@angular/core';
import { UsuarioActivoService } from '../../servicios/usuario-activo.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  sesionActiva = false;

  constructor(private usuarioActivo: UsuarioActivoService, private router: Router) {}

  ngOnInit() {
    this.usuarioActivo.sesionActiva$.subscribe(estado => {
      this.sesionActiva = estado;
    });
  }

  cerrarSesion() {
    this.usuarioActivo.limpiarUsuario();
    this.router.navigate(['/inicio']);

    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd'
    });
  }

}