import { EspecialidadesComponent } from "../componentes/seccionAdministrador/especialidades/especialidades.component";

export class Seccional {
    idSeccional: number;
    nombre: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    telefono: string;
    email: string;
    imagen: string = '';
    /*especialidades?: Especialidad[];*/


    constructor(){
        this.idSeccional = 0;
        this.nombre = '';
        this.direccion= '';
        this.ciudad= '';
        this.provincia= '';
        this.telefono= '';
        this.email= '';
    }
}