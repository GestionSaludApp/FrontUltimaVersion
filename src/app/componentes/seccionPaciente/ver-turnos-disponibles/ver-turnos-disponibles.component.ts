import { Component, OnInit } from '@angular/core';
import { Turno } from '../../../clases/turno';
import { Disponibilidad } from '../../../clases/disponibilidad';
import { BasededatosService } from '../../../servicios/basededatos.service';
import { NgFor, NgIf } from '@angular/common';
import { dias } from '../../../funciones/fechas';
import { especialidades, seccionales } from '../../../funciones/listas';
import { FormsModule } from '@angular/forms';
import { UsuarioActivoService } from '../../../servicios/usuario-activo.service';
import { TitleCasePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Seccional } from '../../../clases/seccional';
import { Especialidad } from '../../../clases/especialidad';

@Component({
  selector: 'app-ver-turnos-disponibles',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, TitleCasePipe],
  templateUrl: './ver-turnos-disponibles.component.html',
  styleUrl: './ver-turnos-disponibles.component.css'
})
export class VerTurnosDisponiblesComponent implements OnInit {
  diasLocal = dias;
  seccionalesLocal: Seccional[] = [];
  especialidadesLocal: Especialidad[] = [];
  
  disponibilidadesActivas: Disponibilidad[] = [];
  turnosDisponibles: Turno[] = [];
  turnosActivos: Turno[] = [];

  duracion: number = 20;

  filtroActivo: boolean = false;
  filtroDia: number | null = null;
  filtroSeccional: number | null = null;
  filtroEspecialidad: number | null = null;
  filtroDiaFiltro: number | null = null;
  filtroSeccionalFiltro: number | null = null;
  filtroEspecialidadFiltro: number | null = null;

  constructor(
    private baseDeDatos: BasededatosService, 
    private usuarioActual: UsuarioActivoService,
    private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    this.cargarDatosBasicos();

    // Cargar turnos asignados al usuario al iniciar
    let idPerfil = this.usuarioActual.perfil?.idPerfil;
    if (idPerfil) {
      this.baseDeDatos.buscarTurnosActivos({ idPerfil }).subscribe({
        next: (turnos: Turno[]) => {
          this.turnosActivos = turnos;
        },
        error: (err) => console.error('Error cargando turnos activos:', err)
      });
    }

    this.aplicarFiltros();
  }

  cargarDatosBasicos(){
    // Cargar especialidades y seccionales
    this.baseDeDatos.buscarEspecialidades(() => {
      this.especialidadesLocal = especialidades;
    });
    this.baseDeDatos.buscarSeccionales(() => {
      this.seccionalesLocal = seccionales.slice(1);
    });
  }
  
  filtrar(tipo: string, dato: any){
    if (tipo === 'dia') {this.filtroDiaFiltro = dato;}
    if (tipo === 'seccional') {this.filtroSeccionalFiltro = dato;}
    if (tipo === 'especialidad') {this.filtroEspecialidadFiltro = dato;}
  }

  aplicarFiltros() {
    const filtros: any = {};
  
    if (this.filtroDia !== null) filtros.diaSemana = this.filtroDiaFiltro;
    if (this.filtroSeccional !== null) filtros.idSeccional = this.filtroSeccionalFiltro;
    if (this.filtroEspecialidad !== null) filtros.idEspecialidad = this.filtroEspecialidadFiltro;

    this.baseDeDatos.buscarTurnos(filtros).subscribe({
      next: (turnos: Turno[]) => {
        this.turnosDisponibles = turnos;
      },
      error: (error) => {
        console.error('Error al cargar turnos:', error);
      }
    });
  }

  solicitarTurno(turno: Turno) {
    let idPerfil = this.usuarioActual.perfil?.idPerfil;
    if (idPerfil) {
      turno.idPaciente = idPerfil;
    } else {
      return;
    }
    
    this.baseDeDatos.solicitarTurno(turno).subscribe({
      next: () => {
        // Mover turno de disponibles a activos
        this.turnosActivos.push(turno);
        this.turnosDisponibles = this.turnosDisponibles.filter(t => t.idTurno !== turno.idTurno);

        // ✅ Enviar correo al confirmar turno
        const params = {
          email: this.usuarioActual.usuario?.email, // o el correo del paciente
          asunto: 'Confirmación de turno',
          mensaje: `Tu turno fue confirmado para ${turno.especialidad()} el día ${this.diasLocal[turno.diaSemana]} a las ${this.leerMinutos(turno.horaInicio)}.`
        };

        this.http.post('http://localhost:3000/envio', params).subscribe({
          next: resp => console.log('Correo enviado:', resp),
          error: err => console.error('Error al enviar correo:', err)
        });

        Swal.fire({
          title: '¡Turno confirmado!',
          text: 'Tu turno fue reservado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0d6efd'
        });
      },
      error: (error) => {
        console.error('Error al solicitar turno:', error);
        Swal.fire({
          title: 'Error al confirmar turno',
          text: 'No se pudo reservar el turno. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  // convierte minutos a formato hh:mm
  leerMinutos(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  verFecha(codigo: string): string {
    const match = codigo.match(/d(\d{2})(\d{2})(\d{4})/);

    if (!match) {
      return '';
    }

    const dia = match[1];
    const mes = match[2];
    const anio = match[3];

    let fecha = `${dia}/${mes}/${anio}`;
    return fecha;
  }

  //cancelar los turnos 
  cancelarTurno(turno: Turno) {
    Swal.fire({
      title: 'Cancelar turno',
      input: 'text',
      inputLabel: 'Motivo de cancelación',
      inputPlaceholder: 'Escribí el motivo...',
      showCancelButton: true,
      confirmButtonText: 'Confirmar cancelación',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#d33'
    }).then(result => {
      if (result.isConfirmed && result.value) {
          this.baseDeDatos.cancelarTurno(this.usuarioActual.idUsuario, turno.idTurno, result.value).subscribe({
          next: () => {
            Swal.fire('Cancelado', 'El turno fue cancelado correctamente.', 'success');
            this.turnosActivos = this.turnosActivos.filter(t => t.idTurno !== turno.idTurno);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo cancelar el turno. Intentalo de nuevo.', 'error');
          }
        });
      }
    });
  }
}