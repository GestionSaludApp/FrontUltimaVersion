import { dias, leerMinutos } from "../funciones/fechas";
import { nombresEspecialidades, nombresSeccionales } from "../funciones/listas";

export class Turno {
    idTurno: string;
    idPaciente: number = 0;
    idProfesional: number = 0;
    nombreProfesional: string = '';
    idSeccional: number;
    seccionalNombre: string;
    idEspecialidad: number;
    especialidadNombre: string;
    diaSemana: number;
    horaInicio: number;
    horaFin: number;
    estado: String;
    motivoCancelacion?: String;

    constructor(){
        this.idTurno = '';
        this.idSeccional = 0;
        this.seccionalNombre = '';
        this.idEspecialidad = 0;
        this.especialidadNombre = '';
        this.diaSemana = 0;
        this.horaInicio = 0;
        this.horaFin = 0;
        this.estado= '';
        this.motivoCancelacion = '';
    }
    
    cargarDatos(datos: Partial<Turno>) {
        Object.assign(this, datos);
        this.especialidadNombre = nombresEspecialidades[this.idEspecialidad];
        this.seccionalNombre = nombresSeccionales[this.idSeccional];
    }

    seccional():string{
        return this.seccionalNombre;
    }
    especialidad(): string {
        return this.especialidadNombre;
    }
    dia():string{
        return dias[this.diaSemana];
    }
    horarioInicio():string{
        return leerMinutos(this.horaInicio);
    }
    horarioFin():string{
        return leerMinutos(this.horaFin);
    }
}