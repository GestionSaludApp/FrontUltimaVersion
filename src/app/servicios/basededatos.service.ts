import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { Usuario } from '../clases/usuario';
import { UsuarioActivoService } from './usuario-activo.service';
import { Administrador, Paciente, Perfil, Profesional } from '../clases/perfil';
import { Disponibilidad } from '../clases/disponibilidad';
import { Turno } from '../clases/turno';
import { cargarEspecialidades, cargarSeccionales } from '../funciones/listas';
import { Especialidad } from '../clases/especialidad';
import { Seccional } from '../clases/seccional';
import { bddURL } from '../credenciales/datos';
import { Reporte } from '../clases/reporte';
import { Audicion } from '../clases/audicion';

@Injectable({
  providedIn: 'root'
})

export class BasededatosService {
  private apiUrl = bddURL;

  constructor(private http: HttpClient, private usuarioActivo: UsuarioActivoService) {}

  registrarUsuario(nuevoUsuario: Usuario, nuevoPerfil: Perfil, imagen: File | null): Observable<any> {
    const crearBody = () => {
      const body = new FormData();
      body.append('nuevoUsuario', JSON.stringify(nuevoUsuario));
      body.append('nuevoPerfil', JSON.stringify(nuevoPerfil));
      return body;
    };

    if (imagen) {
      return this.guardarImagen('perfilesUsuarios', imagen).pipe(
        switchMap((res: any) => {
          console.log(res);
          nuevoPerfil.imagen = res.resultado;

          return this.http.post(this.apiUrl + '/registrarUsuario', crearBody());
        }),
        catchError(error => {
          console.error('Error al registrar usuario:', error);
          throw error;
        })
      );
    } else {

      return this.http.post(this.apiUrl + '/registrarUsuario', crearBody()).pipe(
        catchError(error => {
          console.error('Error al registrar usuario:', error);
          throw error;
        })
      );
    }
  }

  activarUsuario(email: string, password: string, codigo: string): Observable<any> {
    return this.http.post(this.apiUrl + '/activarMiUsuario', { email, password, codigo });
  }

  ingresarUsuario(email: string, password: string): Observable<Usuario> {
    const body = { email, password };

    return this.http.post<any>(this.apiUrl + '/ingresarUsuario', body).pipe(
      tap(datos => {
        this.usuarioActivo.setUsuario(datos.usuario, datos.perfilActivo);
      }),
      catchError(error => {
        console.error('Error al ingresar usuario:', error);
        return throwError(() => error);
      })
    );
  }

  ingresarPerfil(idUsuario: number, idPerfil: number): Observable<Perfil> {
    const body = { idUsuario, idPerfil };

    return this.http.post<any>(this.apiUrl + '/ingresarPerfil', body).pipe(
      tap(datos => {
        this.usuarioActivo.setPerfil(datos.perfilActivo);
      }),
      catchError(error => {
        console.error('Error al buscar perfil:', error);
        return throwError(() => error);
      })
    );
  }

  registrarPerfilAdicional(idUsuario: number, nuevoPerfil: Perfil): Observable<any> {

    const body = {
      idUsuario: idUsuario,
      nuevoPerfil: nuevoPerfil
    };

    console.log(body);

    return this.http.post(this.apiUrl + '/registrarPerfilAdicional', body)
      .pipe(
        catchError(error => {
          console.error('Error al registrar el nuevo perfil:', error);
          return throwError(error);
        })
      );

  }
  
  buscarDisponibilidades(filtros: any): Observable<Disponibilidad[]> {
    return this.http.post<any[]>(this.apiUrl + '/buscarDisponibilidades', filtros).pipe(
      map(respuesta => {
        return respuesta.map(datos => {
          const disponibilidad = new Disponibilidad();
          disponibilidad.cargarDatos(datos);
          return disponibilidad;
        });
      })
    );
  }

  buscarTurnos(filtros: any): Observable<Turno[]> {
    return this.http.post<any[]>(this.apiUrl + '/buscarTurnos', filtros).pipe(
      map(respuesta => {
        return respuesta.map(datos => {
          const turno = new Turno();
          turno.cargarDatos(datos);
          return turno;
        });
      })
    );
  }

  buscarTurnosActivos(filtros: any): Observable<Turno[]> {
    return this.http.post<any[]>(this.apiUrl + '/buscarTurnosPorUsuario', filtros).pipe(
      map(respuesta => {
        return respuesta.map(datos => {
          const turno = new Turno();
          turno.cargarDatos(datos);
          return turno;
        });
      })
    );
  }

  obtenerTurnosActivos(): Observable<Turno[]> {
    return this.http.post<any[]>(
      this.apiUrl + '/obtenerTurnosActivos',
      {} // no recibe parámetros
    ).pipe(
      map(respuesta => {
        return respuesta.map(datos => {
          const turno = new Turno();
          turno.cargarDatos(datos);
          return turno;
        });
      })
    );
  }

  buscarReportes(idPaciente: number): Observable<Reporte[]> {
    return this.http
      .post<any[]>(this.apiUrl + '/buscarReportesPorPaciente', { idPaciente })
      .pipe(
        map(lista =>
          lista.map(datos => {
            const reporte = new Reporte();
            reporte.cargarDatos(datos);
            return reporte;
          })
        )
      );
  }

  buscarProfesionalesPorPaciente(idPerfilPaciente: number) {
    return this.http.post<
      { idPerfilProfesional: number; nombre: string }[]
    >(
      this.apiUrl + '/buscarProfesionalesPorPaciente',
      { idPerfilPaciente }
    );
  }

  solicitarTurno(turno: Turno): Observable<Turno> {
    return this.http.post<any>(this.apiUrl + '/solicitarTurno', turno).pipe(
      map(respuesta => {
        //puse este log para que me diga bien cual es el error
        console.log('Respuesta del backend:', respuesta);
        //entonces cambie de valido a exito
        if (respuesta.exito && respuesta.turno) {
          const nuevoTurno = new Turno();
          //Si el backend devuelve solo mensaje y idTurno, podés cargar solo idTurno
          nuevoTurno.cargarDatos({ idTurno: respuesta.turno.idTurno });
          return nuevoTurno;
        } else {
          throw new Error(respuesta.mensaje || 'Error al solicitar turno');
        }
      })
    );
  }
  
  cancelarTurno(idUsuario: number, idTurno: string, motivo: string): Observable<any> {
    const body = { idUsuario, idTurno };

    return this.http.post(this.apiUrl + '/cancelarTurno', body).pipe(
      tap(() => console.log('Turno cancelado correctamente')),
        catchError(error => {
        console.error('Error al cancelar turno:', error);
        return throwError(() => error);
      })
    );
  }

  actualizarSituacionTurno(idTurno: string, nuevaSituacion: string) {

    const body = {
      idTurno,
      situacion: nuevaSituacion
    };

    return this.http.post(
      this.apiUrl + '/cambiarSituacionTurno',
      body
    );
  }

  agregarEspecialidad(idUsuario: number, nuevaEspecialidad: Especialidad, imagen: File | null): Observable<any> {
    const crearBody = () => {
      const body = new FormData();
      body.append('idUsuario', JSON.stringify(idUsuario));
      body.append('nuevaEspecialidad', JSON.stringify(nuevaEspecialidad));
      return body;
    }

    if (imagen) {
      return this.guardarImagen('logosEspecialidad', imagen).pipe(
        switchMap((res: any) => {
          nuevaEspecialidad.imagen = res.resultado;

          return this.http.post(this.apiUrl + '/agregarEspecialidad', crearBody());
        }),
        catchError(error => {
          console.error('Error al registrar la nueva especialidad:', error);
          throw error;
        })
      );
    } else {

      return this.http.post(this.apiUrl + '/agregarEspecialidad', crearBody()).pipe(
        catchError(error => {
          console.error('Error al registrar la nueva especialidad:', error);
          throw error;
        })
      );
    }
  }

  buscarEspecialidades(callback: () => void) {
    this.http.post<Especialidad[]>(this.apiUrl +'/buscarEspecialidades','').subscribe({
      next: (listaEspecialidades) => {
        cargarEspecialidades(listaEspecialidades);
        callback();
      },
      error: (err) => {
        console.error('Error al cargar especialidades', err);
      }
    });
  }

  editarEspecialidad(idUsuario: number, datosEspecialidad: Especialidad): Observable<any>{
    const body = { idUsuario, datosEspecialidad };
    return this.http.post(this.apiUrl + '/editarEspecialidad', body);
  }

  eliminarEspecialidad(idUsuario: number, datosEspecialidad: Especialidad): Observable<any>{
    const body = { idUsuario, datosEspecialidad };
    return this.http.post(this.apiUrl + '/eliminarEspecialidad', body);
  }

  agregarSeccional(idUsuario: number, nuevaSeccional: Seccional, imagen: File | null): Observable<any>{
    const crearBody = () => {
      const body = new FormData();
      body.append('idUsuario', JSON.stringify(idUsuario));
      body.append('nuevaSeccional', JSON.stringify(nuevaSeccional));
      return body;
    }

    if (imagen) {
      return this.guardarImagen('logosSeccionales', imagen).pipe(
        switchMap((res: any) => {
          nuevaSeccional.imagen = res.resultado;

          return this.http.post(this.apiUrl + '/agregarSeccional', crearBody());
        }),
        catchError(error => {
          console.error('Error al registrar la nueva seccional:', error);
          throw error;
        })
      );
    } else {

      return this.http.post(this.apiUrl + '/agregarSeccional', crearBody()).pipe(
        catchError(error => {
          console.error('Error al registrar la nueva seccional:', error);
          throw error;
        })
      );
    }
  }

  buscarSeccionales(callback: () => void) {
    this.http.post<Seccional[]>(this.apiUrl +'/buscarSeccionales','').subscribe({
      next: (listaSeccionales) => {
        cargarSeccionales(listaSeccionales);
        callback();
      },
      error: (err) => {
        console.error('Error al cargar seccionales', err);
      }
    });
  }

  editarSeccional(idUsuario: number, datosSeccional: Seccional): Observable<any>{
    const body = { idUsuario, datosSeccional };
    return this.http.post(this.apiUrl + '/editarSeccional', body);
  }

  eliminarSeccional(idUsuario: number, datosSeccional: Seccional): Observable<any>{
    const body = { idUsuario, datosSeccional };
    return this.http.post(this.apiUrl + '/eliminarSeccional', body);
  }

  agregarReporte(idUsuario: number, nuevoReporte: Reporte, imagen: File | null): Observable<any> {
    const crearBody = () => {
      const body = new FormData();
      body.append('idUsuario', JSON.stringify(idUsuario));
      body.append('nuevoReporte', JSON.stringify(nuevoReporte));
      return body;
    }

    if (imagen) {
      return this.guardarImagen('reportesMedicos', imagen).pipe(
        switchMap((res: any) => {
          nuevoReporte.imagen = res.resultado;

          return this.http.post(this.apiUrl + '/agregarReporte', crearBody());
        }),
        catchError(error => {
          console.error('Error al agregar el reporte:', error);
          throw error;
        })
      );
    } else {

      return this.http.post(this.apiUrl + '/agregarReporte', crearBody()).pipe(
        catchError(error => {
          console.error('Error al agregar el reporte:', error);
          throw error;
        })
      );
    }
  }

  guardarImagen(directorio: string, imagen: File | null): Observable<any>{
    const body = new FormData();

    body.append('directorio', JSON.stringify(directorio));
    if (imagen) {body.append('imagen', imagen);}

    return this.http.post(this.apiUrl + '/guardarImagen', body);
  }

  buscarAuditorias(cantidad: number, callback: (auditorias: Audicion[]) => void) {

    const body = { cantidad };

    this.http.post<any[]>(this.apiUrl + '/buscarAuditoria', body).subscribe({
      next: (lista) => {

        const auditorias: Audicion[] = [];

        lista.forEach(a => {
          const aud = new Audicion();
          aud.cargarDatos(a);
          auditorias.push(aud);
        });

        callback(auditorias);
      },
      error: (err) => {
        console.error('Error al buscar auditorías', err);
      }
    });
  }

  buscarPendientes(callback: (pendientes: {
    especialidades: Especialidad[];
    perfiles: Perfil[];
    seccionales: Seccional[];
    turnos: Turno[];
    usuarioPerfiles: Perfil[];
    usuarios: Usuario[];
  }) => void) {

    this.http.post<any>(this.apiUrl + '/buscarPendientes', {}).subscribe({
      next: (data) => {

        const resultado = {
          especialidades: [] as Especialidad[],
          perfiles: [] as Perfil[],
          seccionales: [] as Seccional[],
          turnos: [] as Turno[],
          usuarioPerfiles: [] as Perfil[],
          usuarios: [] as Usuario[]
        };

        data.especialidades?.forEach((e: any) => {
          const esp = new Especialidad();
          esp.cargarDatos(e);
          resultado.especialidades.push(esp);
        });

        data.perfiles?.forEach((p: any) => {
          const per = new Perfil();
          per.cargarDatos(p);
          resultado.perfiles.push(per);
        });

        data.seccionales?.forEach((s: any) => {
          const sec = new Seccional();
          sec.cargarDatos(s);
          resultado.seccionales.push(sec);
        });

        data.turnos?.forEach((t: any) => {
          const tur = new Turno();
          tur.cargarDatos(t);
          resultado.turnos.push(tur);
        });

        data.usuarioPerfiles?.forEach((up: any) => {
          const uper = new Perfil();
          uper.cargarDatos(up);
          resultado.usuarioPerfiles.push(uper);
        });

        data.usuarios?.forEach((u: any) => {
          const usu = new Usuario();
          usu.cargarDatos(u);
          resultado.usuarios.push(usu);
        });

        callback(resultado);
      },
      error: (err) => {
        console.error('Error al buscar pendientes', err);
      }
    });
  }

  enviarConsulta(nombre: string, email: string, mensaje: string) {
    const body = {
      nombre,
      email,
      mensaje
    };

    return this.http.post(
      this.apiUrl + '/enviarConsulta',
      body
    );
  }

  cambiarEstado(
    tabla: string,
    id: string | number,
    nuevoEstado: string,
    callback: () => void
  ) {

    const body = {
      tabla,
      id,
      nuevoEstado
    };

    this.http.post(this.apiUrl + '/cambiarEstado', body).subscribe({
      next: () => {
        callback();
      },
      error: (err) => {
        console.error('Error al cambiar estado', err);
      }
    });
  }

  buscarPerfilesPorPermiso(callback: (resultado: {
    permiso1: Administrador[];
    permiso2: Profesional[];
    permiso3: Paciente[];
  }) => void) {

    this.http.post<any>(this.apiUrl + '/buscarPerfilesPorPermiso', {}).subscribe({
      next: (data) => {

        const resultado = {
          permiso1: [] as Administrador[],
          permiso2: [] as Profesional[],
          permiso3: [] as Paciente[]
        };

        data.permiso1?.forEach((p: any) => {
          const per = new Administrador();
          per.cargarDatos(p);
          resultado.permiso1.push(per);
        });

        data.permiso2?.forEach((p: any) => {
          const per = new Profesional();
          per.cargarDatos(p);
          resultado.permiso2.push(per);
        });

        data.permiso3?.forEach((p: any) => {
          const per = new Paciente();
          per.cargarDatos(p);
          resultado.permiso3.push(per);
        });

        callback(resultado);
      },
      error: (err) => {
        console.error('Error al buscar perfiles por permiso', err);
      }
    });
  }

  buscarReportesPorPaciente(
    idPaciente: number,
    callback: (reportes: Reporte[]) => void
  ) {
    const body = { idPaciente };

    this.http.post<any[]>(this.apiUrl + '/buscarReportesPorPaciente', body)
      .subscribe({
        next: (lista) => {

          const reportes: Reporte[] = [];

          lista.forEach(r => {
            const rep = new Reporte();
            rep.cargarDatos(r);
            reportes.push(rep);
          });

          callback(reportes);
        },
        error: (err) => {
          console.error('Error al buscar reportes del paciente', err);
        }
      });
  }

  reiniciarPassword(email: string): Observable<any> {
    return this.http.post(
      this.apiUrl + '/reiniciarPassword',
      { email }
    );
  }

  cambiarPassword(email: string, codigo: string, nuevaPassword: string) {
    return this.http.post(`${this.apiUrl}/cambiarPassword`, {
      email,
      codigo,
      nuevaPassword
    });
  }

}
