import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavegacionService {

  constructor(private router: Router) {}

  irInicio(){this.router.navigate(['/inicio']);}
  irIngreso(){this.router.navigate(['/ingreso']);}

  irRegistro(){this.router.navigate(['/registro']);}
  irAyuda(){this.router.navigate(['/ayuda']);}
  irError(){this.router.navigate(['/error']);}
  irOferta(){this.router.navigate(['/oferta']);}

  //TODOS LOS USUARIOS
  irDatosPersonales(){this.router.navigate(['/datosPersonales']);}

  //SECCION PACIENTE
  irTurnosDisponibles(){this.router.navigate(['/turnosDisponibles']);}
  irAgenda(){this.router.navigate(['/turnosActivos']);}
  irHistoriaClinica(){this.router.navigate(['/historiaClinica']);}

  //SECCION PROFESIONAL
  irTurnosAtencion(){this.router.navigate(['/turnosAtencion']);}
  irRecepcionProfesional(){this.router.navigate(['/recepcionProfesional']);}
  irHistoriaClinicaProfesional(){this.router.navigate(['/historiaClinicaProfesional']);}

  //SECCION ADMINISTRADOR
  irEspecialidades(){this.router.navigate(['/especialidades']);}
  irSeccionales(){this.router.navigate(['/seccionales']);}
  irRecepcionAdministrador(){this.router.navigate(['/recepcionAdministrador']);}
  irPersonal(){this.router.navigate(['/personal']);}
  irClientes(){this.router.navigate(['/clientes']);}
  irHabilitaciones(){this.router.navigate(['/habilitaciones']);}
  irAuditoria(){this.router.navigate(['/auditoria']);}
  
}

  

