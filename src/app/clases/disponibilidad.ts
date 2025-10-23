import { dias, leerMinutos } from "../funciones/fechas";
import { especialidades, seccionales } from "../funciones/listas";

export class Disponibilidad {
    idProfesional : number;
    idDisponibilidad: number;
    idSeccional: number;
    idEspecialidad: number;
    diaSemana: number;
    horaInicio: number;
    horaFin: number;

    constructor(){
        this.idProfesional = 0;
        this.idDisponibilidad = 0;
        this.idSeccional = 0;
        this.idEspecialidad = 0;
        this.diaSemana = 0;
        this.horaInicio = 0;
        this.horaFin = 0;
    }
    
    cargarDatos(datos: Partial<Disponibilidad>) {
        Object.assign(this, datos);
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




