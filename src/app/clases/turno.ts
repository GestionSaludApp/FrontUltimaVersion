import { dias, leerMinutos } from "../funciones/fechas";
import { especialidades, seccionales } from "../funciones/listas";

export class Turno {
    idTurno: string;
    idPaciente: number = 0;
    idProfesional: number = 0;
    idSeccional: number;
    idEspecialidad: number;
    diaSemana: number;
    horaInicio: number;
    horaFin: number;
    estado: String;
    motivoCancelacion?: String;

    constructor(){
        this.idTurno = '';
        this.idSeccional = 0;
        this.idEspecialidad = 0;
        this.diaSemana = 0;
        this.horaInicio = 0;
        this.horaFin = 0;
        this.estado= '';
        this.motivoCancelacion = '';
    }
    
    cargarDatos(datos: Partial<Turno>) {
        Object.assign(this, datos);
    }

    seccional():string{
        return seccionales[this.idSeccional].nombre;
    }
    especialidad(): string {
        return especialidades[this.idEspecialidad].nombre;
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