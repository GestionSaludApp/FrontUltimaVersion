import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

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
  fechaSeleccionada: string | null = null;
  horaSeleccionada: string | null = null;
  horariosDisponibles: { hora: string; disponible: boolean }[] = [];
  private modalInstance: any;

  constructor(private cdr: ChangeDetectorRef) {}

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
      this.calendarOptions.events = [
        { title: 'Disponible', date: '2025-09-03', color: 'green' },
        { title: 'No disponible', date: '2025-09-04', color: 'red' }
      ];
    } else if (estudio === 'Rayos X') {
      this.calendarOptions.events = [
        { title: 'Disponible', date: '2025-09-05', color: 'green' },
        { title: 'No disponible', date: '2025-09-06', color: 'red' }
      ];
    } else {
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
      { hora: '09:30', disponible: false },
      { hora: '11:00', disponible: true },
      { hora: '14:00', disponible: true }
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
}