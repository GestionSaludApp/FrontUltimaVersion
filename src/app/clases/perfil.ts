import { prefijoImagen } from "../credenciales/datos";
import { especialidades } from "../funciones/listas";
import { Disponibilidad } from "./disponibilidad";
import { Reporte } from "./reporte";

export class Perfil<T = Perfil<any>> {
    //desde tabla usuarioPerfiles
    idPerfil: number;
    idUsuario: number;
    categoria: string;
    alias: string;
    rol: 'paciente' | 'profesional' | 'administrador' | null | undefined = null;
    imagen: string = prefijoImagen + 'v1756774763/perfilesUsuarios/cthtfwco3ir2bwwpbyih.png';

    //desde tabla usuariosRol [común a todos]
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento: string;

    constructor(){
        this.idPerfil = 0;
        this.idUsuario = 0;
        this.categoria = '';
        this.alias = '';

        this.nombre = '';
        this.apellido = '';
        this.dni = '';
        this.fechaNacimiento = '';
    }

    cargarDatos(datos: Partial<T>) {
      Object.assign(this, datos);
    }

}

export class Paciente extends Perfil<Paciente>{
  historiaClinica: Reporte[] = [];
  
  constructor(){
    super();
    this.rol = 'paciente';
  }

}

export class Profesional extends Perfil<Profesional> {
  idEspecialidad: number;
  disponibilidad: Disponibilidad[];

  constructor() {
    super();
    this.rol = 'profesional';
    this.idEspecialidad = 0;
    this.disponibilidad = [];
  }

  // 👉 Nombre de la especialidad
  get especialidad(): string {
    return especialidades.find(e => e.idEspecialidad === this.idEspecialidad)?.nombre || 'Sin especialidad';
  }

  // 👉 Cronograma legible
  get cronograma() {
    return this.disponibilidad.map(d => ({
      seccional: () => `Seccional ${d.idSeccional}`,
      dia: () => this.nombreDia(d.diaSemana),
      horarioInicio: () => this.formatearHora(d.horaInicio),
      horarioFin: () => this.formatearHora(d.horaFin)
    }));
  }

  private nombreDia(dia: number): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[dia] || `Día ${dia}`;
  }

  private formatearHora(hora: number): string {
    // si hora viene en minutos, convierto a hh:mm
    const h = Math.floor(hora);
    const m = (hora % 1) * 60; 
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  // Métodos originales que ya tenías
  getCargaHorariaTotal() {
    let horasTotal = 0;
    for (let disp of this.disponibilidad) {
      let tiempoDisp = disp.horaFin - disp.horaInicio;
      horasTotal = horasTotal + tiempoDisp;
    }
    return horasTotal;
  }

  getCargaHorariaDia(dia: number) {
    let horasTotal = 0;
    for (let disp of this.disponibilidad) {
      if (disp.diaSemana === dia) {
        let tiempoDisp = disp.horaFin - disp.horaInicio;
        horasTotal = horasTotal + tiempoDisp;
      }
    }
    return horasTotal;
  }
}

export class Administrador extends Perfil<Administrador>{
  
  constructor(){
    super();
    this.rol = 'administrador';
  }

}
