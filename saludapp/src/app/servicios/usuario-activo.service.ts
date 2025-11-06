import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Usuario } from '../clases/usuario';
import { Administrador, Paciente, Perfil, Profesional } from '../clases/perfil';
import { Disponibilidad } from '../clases/disponibilidad';

@Injectable({
  providedIn: 'root'
})
export class UsuarioActivoService {

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  private perfilSubject = new BehaviorSubject<Perfil | null>(null);

  private sesionActivaSubject = new BehaviorSubject<boolean>(false);
  sesionActiva$ = this.sesionActivaSubject.asObservable();

  constructor() {
    //  Restaurar usuario desde localStorage al iniciar la app
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    if (usuarioGuardado) {
      try {
        const datos = JSON.parse(usuarioGuardado);
        this.setUsuario(datos.usuario, datos.perfilActivo);
      } catch (e) {
        console.error('Error restaurando sesión guardada:', e);
        localStorage.removeItem('usuarioActivo');
      }
    }

    //  Actualizar estado de sesión cada vez que cambie el usuario
    this.usuarioSubject.subscribe(usuario => {
      this.sesionActivaSubject.next(!!usuario);
    });
  }

  //  CARGAR DATOS DEL USUARIO
  setUsuario(datosUsuario: any, datosPerfilActivo: any): void {
    const usuario = datosUsuario;
    const perfilActivo = datosPerfilActivo;

    let usuarioInstanciado = new Usuario();

    // Asignar tipo de perfil según rol
    if (perfilActivo.rol === 'paciente') {
      usuarioInstanciado.perfilActivo = new Paciente();
    } else if (perfilActivo.rol === 'profesional') {
      usuarioInstanciado.perfilActivo = new Profesional();
    } else if (perfilActivo.rol === 'administrador') {
      usuarioInstanciado.perfilActivo = new Administrador();
    } else {
      console.error('Rol de usuario no reconocido:', perfilActivo.rol);
      return;
    }

    usuarioInstanciado.cargarDatos(usuario);
    usuarioInstanciado.perfilActivo.cargarDatos(perfilActivo);

    // Si es profesional, cargar su disponibilidad
    if (usuarioInstanciado.perfilActivo instanceof Profesional) {
      usuarioInstanciado.perfilActivo.disponibilidad = [];
      for (let disp of perfilActivo.disponibilidad || []) {
        let horario = new Disponibilidad();
        horario.cargarDatos(disp);
        usuarioInstanciado.perfilActivo.disponibilidad.push(horario);
      }
    }

    this.usuarioSubject.next(usuarioInstanciado);

    // Guardar en localStorage
    localStorage.setItem('usuarioActivo', JSON.stringify({ usuario, perfilActivo }));
  }

  // ELIMINAR DATOS DEL USUARIO (cerrar sesión)
  limpiarUsuario(): void {
    this.perfilSubject.next(null);
    this.usuarioSubject.next(null);
    localStorage.removeItem('usuarioActivo'); // 🔹 Borrar del almacenamiento
  }

  //  ACTUALIZAR PERFIL DEL USUARIO
  setPerfil(datosPerfilActivo: any): void {
    const perfilActivo = datosPerfilActivo;

    let usuarioInstanciado = this.usuarioSubject.getValue();
    if (!usuarioInstanciado) return;

    if (perfilActivo.rol === 'paciente') {
      usuarioInstanciado.perfilActivo = new Paciente();
    } else if (perfilActivo.rol === 'profesional') {
      usuarioInstanciado.perfilActivo = new Profesional();
    } else if (perfilActivo.rol === 'administrador') {
      usuarioInstanciado.perfilActivo = new Administrador();
    } else {
      console.error('Rol de usuario no reconocido:', perfilActivo.rol);
      return;
    }

    usuarioInstanciado.perfilActivo.cargarDatos(perfilActivo);

    if (usuarioInstanciado.perfilActivo instanceof Profesional) {
      usuarioInstanciado.perfilActivo.disponibilidad = [];
      for (let disp of perfilActivo.disponibilidad || []) {
        let horario = new Disponibilidad();
        horario.cargarDatos(disp);
        usuarioInstanciado.perfilActivo.disponibilidad.push(horario);
      }
    }

    this.usuarioSubject.next(usuarioInstanciado);

    //  Actualizar en localStorage también
    localStorage.setItem('usuarioActivo', JSON.stringify({
      usuario: usuarioInstanciado,
      perfilActivo
    }));
  }

  //  OBTENER PERFILES DISPONIBLES
  obtenerPerfiles(): Perfil[] {
    if (!this.usuarioSubject.value) {
      throw new Error('No existe un usuario o perfil activo.');
    }

    let listaPerfiles: Perfil[] = [];
    for (let perfil of this.usuarioSubject.value.perfiles) {
      listaPerfiles.push(perfil);
    }

    return listaPerfiles;
  }

  //  VER PERFIL ACTIVO DEL USUARIO
  get perfil(): Paciente | Profesional | Administrador | null | undefined {
    if (!this.usuarioSubject.value) {
      return null;
    }
    return this.usuarioSubject.value.perfilActivo;
  }

  // PERFIL OBSERVABLE
  get perfilObservable$() {
    return this.usuarioSubject.asObservable().pipe(map(usuario => usuario?.perfilActivo ?? null));
  }

  // USUARIO ACTIVO
  get usuario() {
    return this.usuarioSubject.value;
  }

  // USUARIO OBSERVABLE
  get usuarioObservable$() {
    return this.usuarioSubject.asObservable();
  }

  // ID DE USUARIO
  get idUsuario() {
    if (!this.usuarioSubject.value) {
      throw new Error('No existe un usuario o perfil activo.');
    }
    return this.usuarioSubject.value.idUsuario;
  }
}