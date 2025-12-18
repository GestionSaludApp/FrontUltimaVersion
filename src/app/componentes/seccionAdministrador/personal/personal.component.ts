import { Component, OnInit } from '@angular/core';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { Administrador, Profesional } from '../../../clases/perfil';
import { CommonModule, NgFor } from '@angular/common';
import { nombresEspecialidades, nombresSeccionales } from '../../../funciones/listas';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent implements OnInit {

  profesionales: Profesional[] = [];
  administradores: Administrador[] = [];

  constructor(private baseDeDatos: BasededatosService) {}

  ngOnInit(): void {
    this.baseDeDatos.buscarPerfilesPorPermiso((resultado) => {
      this.profesionales = resultado.permiso2;
      this.administradores = resultado.permiso1;
    });
  }

  getNombreEspecialidad(index: number):string{
    return nombresEspecialidades[index];
  }

  getNombreSeccional(index: number):string{
    return nombresSeccionales[index];
  }
}
