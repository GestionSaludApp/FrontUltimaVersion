//class usuario tiene sólo los datos comunes a todos los usuarios, excepto por invitado.
import { Administrador, Paciente, Perfil, Profesional } from "./perfil";


export class Usuario {
  //desde tabla usuarios
  idUsuario: number;
  email: string;
  password: string;
  fechaCreacion: string;
  ultimoIngreso: string;
  perfilActivo: Paciente | Profesional | Administrador | null | undefined;
  perfiles: Perfil[];

  //El constructor inicializa todo vacio para facilitar la gestion en el resto de los componentes.
  constructor(){
    this.idUsuario = 0;
    this.email = '';
    this.password = '';

    this.fechaCreacion = '';
    this.ultimoIngreso = '';

    this.perfilActivo = null;
    this.perfiles = [];
  }

  cargarDatos(datos: Partial<Usuario>) {
    Object.assign(this, datos);
  }

  //Cargar un perfil
  set nuevoPerfilActivo(perfilActivo: Paciente | Profesional | Administrador){
    this.perfilActivo = perfilActivo;
  }

}