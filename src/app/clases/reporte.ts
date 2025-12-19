export class Reporte {
    idReporte: number;
    idSeccional: number;
    idEspecialidad: number;
    fecha: string;
    idPerfilPaciente: number;
    nombrePaciente: string;
    idPerfilProfesional: number;
    nombreProfesional: string;
    idTurno: string;
    informe: string;
    imagen: string = '';

    constructor () {
        this.idReporte = 0;
        this.fecha = '';
        this.idSeccional = 0;
        this.idEspecialidad = 0;
        this.idPerfilPaciente = 0;
        this.nombrePaciente = '';
        this.idPerfilProfesional = 0;
        this.nombreProfesional = '';
        this.idTurno = '';
        this.informe = '';
    }

    cargarDatos(datos: Partial<Reporte>) {
        Object.assign(this, datos);
    }
}