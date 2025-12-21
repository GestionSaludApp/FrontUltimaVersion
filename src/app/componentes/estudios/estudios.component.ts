import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { BasededatosService } from '../../servicios/basededatos.service';
import { Turno } from '../../clases/turno';
import { UsuarioActivoService } from '../../servicios/usuario-activo.service';

@Component({
  selector: 'app-estudios',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './estudios.component.html',
  styleUrls: ['./estudios.component.css']
})
export class EstudiosComponent {
  estudios = ['Laboratorio', 'Rayos X', 'Tomografía', 'Resonancia'];
  estudioSeleccionado: string | null = null;
  estudioCodigo: string = '';
  fechaSeleccionada: string | null = null;
  horaSeleccionada: string | null = null;
  horariosDisponibles: { hora: string; disponible: boolean }[] = [];
  private modalInstance: any;

  constructor(private cdr: ChangeDetectorRef, private usuarioActual: UsuarioActivoService, private baseDeDatos: BasededatosService) {}

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    selectable: true,
    events: [],
    dateClick: (info) => this.onDateClick(info)
  };

  seleccionarEstudio(estudio: string) {
    this.estudioSeleccionado = estudio;

    // Fechas simuladas por tipo de estudio
    if (estudio === 'Laboratorio') {
      this.estudioCodigo = 'Lab';
      this.calendarOptions.events = [
        { title: 'Disponible', date: '2025-09-03', color: 'green' },
        { title: 'No disponible', date: '2025-09-04', color: 'red' }
      ];
    } else if (estudio === 'Rayos X') {
      this.estudioCodigo = 'Rx';
      this.calendarOptions.events = [
        { title: 'Disponible', date: '2025-09-05', color: 'green' },
        { title: 'No disponible', date: '2025-09-06', color: 'red' }
      ];
    } else if (estudio === 'Tomografía') {
      this.estudioCodigo = 'Tmg';
      this.calendarOptions.events = [
        { title: 'Disponible', date: '2025-09-05', color: 'green' },
        { title: 'No disponible', date: '2025-09-06', color: 'red' }
      ];
    } else if (estudio === 'Resonancia') {
      this.estudioCodigo = 'Res';
      this.calendarOptions.events = [
        { title: 'Disponible', date: '2025-09-05', color: 'green' },
        { title: 'No disponible', date: '2025-09-06', color: 'red' }
      ];
    } else {
      this.estudioCodigo = 'Otr';
      this.calendarOptions.events = [
        { title: 'Disponible', date: '2025-09-07', color: 'green' },
        { title: 'No disponible', date: '2025-09-08', color: 'red' }
      ];
    }

    this.cdr.detectChanges();
  }

  onDateClick(info: any) {
    this.fechaSeleccionada = info.dateStr;
    this.horariosDisponibles = [
      { hora: '08:00', disponible: true },
      { hora: '09:30', disponible: true },
      { hora: '11:00', disponible: true },
      { hora: '12:00', disponible: true },
      { hora: '13:30', disponible: true },
      { hora: '15:00', disponible: true }
    ];

    const modal = document.getElementById('horariosModal');
    if (modal) {
      if (!this.modalInstance) {
        this.modalInstance = new (window as any).bootstrap.Modal(modal);
      }
      this.modalInstance.show();
    }
  }

  confirmarTurno(hora: string) {
    this.horaSeleccionada = hora;

    if (this.modalInstance) {
      this.modalInstance.hide();
    }

    const nuevoTurno = new Turno();
    const datosTurno: Partial<Turno> = {
      idTurno: 's0p'+this.usuarioActual.perfil?.idPerfil+'e'+this.estudioCodigo+'d'+this.formatearFecha(this.fechaSeleccionada)+'h'+this.horaAMinutos(this.horaSeleccionada),
      idPaciente: this.usuarioActual.perfil?.idPerfil,
      idPerfilPaciente: this.usuarioActual.perfil?.idPerfil,
      idEspecialidad: 0,
      idProfesional: 0,
      diaSemana: this.obtenerDiaSemana(this.fechaSeleccionada),
      horaInicio: this.horaAMinutos(this.horaSeleccionada),
      horaFin: this.horaAMinutos(this.horaSeleccionada) +60,
    };
    nuevoTurno.cargarDatos(datosTurno);
    this.solicitarTurno(nuevoTurno);

    // 🚀 SweetAlert con confirmación
    Swal.fire({
      title: 'Turno confirmado!',
      html: `<p>Estudio: <b>${this.estudioSeleccionado}</b></p>
             <p>Fecha: <b>${this.fechaSeleccionada}</b></p>
             <p>Hora: <b>${hora}</b></p>`,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745'
    }).then(() => {
      // Cuando se cierra el alert -> descargar PDF
      this.descargarPDF();
    });
  }

  descargarPDF() {
    if (!this.estudioSeleccionado || !this.fechaSeleccionada || !this.horaSeleccionada) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Comprobante de Turno', 20, 20);

    doc.setFontSize(12);
    doc.text(`Estudio: ${this.estudioSeleccionado}`, 20, 40);
    doc.text(`Fecha: ${this.fechaSeleccionada}`, 20, 50);
    doc.text(`Hora: ${this.horaSeleccionada}`, 20, 60);
    doc.text(`Requisitos: Presentarse 15 minutos antes con DNI`, 20, 80);

    doc.save('comprobante_turno.pdf');
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

  horaAMinutos(hora: string|null): number {
    if (hora) {
      const [h, m] = hora.split(':').map(Number);
      return h * 60 + m;
    }
    return 0;
  }

  formatearFecha(fecha: string|null): string {
    if (fecha) {
      const [anio, mes, dia] = fecha.split('-');
      return `${dia}${mes}${anio}`;
    }
    return '00000000';
  }

  obtenerDiaSemana(fecha: string|null): number {
    if (fecha) {
      const [anio, mes, dia] = fecha.split('-').map(Number);
      const date = new Date(anio, mes - 1, dia);
      return date.getDay();
    }
    return 0;
  }

}