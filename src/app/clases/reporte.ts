export class Reporte {
    idReporte: number;
    idPerfilPaciente: number;
    idPerfilProfesional: number;
    idTurno: string;
    informe: string;
    imagen: string = '';

    constructor () {
        this.idReporte = 0;
        this.idPerfilPaciente = 0;
        this.idPerfilProfesional = 0;
        this.idTurno = '';
        this.informe = '';
    }
}