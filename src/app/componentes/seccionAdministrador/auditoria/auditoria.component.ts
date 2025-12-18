import { Component, OnInit } from '@angular/core';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { Audicion } from '../../../clases/audicion';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.css'
})

export class AuditoriaComponent implements OnInit {
  auditoriasActuales: Audicion[] = [];
  
  constructor(private baseDeDatos: BasededatosService) {}
  
  ngOnInit(): void {
    this.baseDeDatos.buscarAuditorias(0, (auditorias) => {
      this.auditoriasActuales = auditorias;
    });
  }

}
