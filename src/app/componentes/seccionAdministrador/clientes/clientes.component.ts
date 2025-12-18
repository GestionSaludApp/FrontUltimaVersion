import { Component, OnInit } from '@angular/core';
import { Paciente } from '../../../clases/perfil';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { CommonModule, NgFor } from '@angular/common';


@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  pacientes: Paciente[] = [];

  constructor(private baseDeDatos: BasededatosService) {}

  ngOnInit(): void {
    this.baseDeDatos.buscarPerfilesPorPermiso((resultado) => {
      this.pacientes = resultado.permiso1;
    });
  }
}
