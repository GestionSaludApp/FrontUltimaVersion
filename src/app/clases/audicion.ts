export class Audicion {
    idAuditoria: number = 0;
    fecha: string = '';
    idUsuario: number = 0;
    nombreUsuario: string = '';
    IP: string = '';
    cambio: string = '';

    constructor(){
    }
    
    cargarDatos(datos: Partial<Audicion>) {
        Object.assign(this, datos);
    }
}