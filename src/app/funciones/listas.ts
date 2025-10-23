import { Especialidad } from "../clases/especialidad";
import { Seccional } from "../clases/seccional";

export const rolesUsuario = ['paciente', 'profesional', 'administrador'];
export const categoriasPerfil = ['principal', 'alternativo', 'subrogado'];

export var especialidades: Especialidad[] = [];
export var seccionales: Seccional[] = [];

export function cargarEspecialidades(listaEspecialidades: Especialidad[]) {
  especialidades = [];
  for (let especialidad of listaEspecialidades) {
    especialidades.push(especialidad);
  }
}

export function cargarSeccionales(listaSeccionales: Seccional[]) {
  seccionales = [];
  for (let seccional of listaSeccionales) {
    seccionales.push(seccional);
  }
}