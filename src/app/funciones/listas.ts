import { Especialidad } from "../clases/especialidad";
import { Seccional } from "../clases/seccional";

export const rolesUsuario = ['paciente', 'profesional', 'administrador'];
export const categoriasPerfil = ['principal', 'alternativo', 'subrogado'];

export var especialidades: Especialidad[] = [];
export var seccionales: Seccional[] = [];

export var nombresEspecialidades: string[] = [
  'Cardiología',
  'Clínica Médica',
  'Dermatología',
  'Endocrinología',
  'Ginecología',
  'Neurología',
  'Oftalmología',
  'Oncología',
  'Otorrinolaringología',
  'Pediatría',
  'Psiquiatría',
  'Traumatología'
];

export var nombresSeccionales: string[] = [
  'Avellaneda Centro',
  'Ituzaingó Centro',
  'La Plata',
  'Lomas de Zamora',
  'Morón',
  'Quilmes',
];

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