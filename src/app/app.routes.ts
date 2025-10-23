import { Routes } from '@angular/router';

import { InicioComponent } from './componentes/inicio/inicio.component';
import { IngresoComponent } from './componentes/ingreso/ingreso.component';
import { AyudaComponent } from './componentes/estaticos/ayuda/ayuda.component';
import { ErrorComponent } from './componentes/estaticos/error/error.component';

import { RegistroComponent } from './componentes/registro/registro.component';

import { DatosPersonalesComponent } from './componentes/usuario/datos-personales/datos-personales.component';
import { VerTurnosDisponiblesComponent } from './componentes/seccionPaciente/ver-turnos-disponibles/ver-turnos-disponibles.component';
import { VerTurnosActivosComponent } from './componentes/seccionPaciente/ver-turnos-activos/ver-turnos-activos.component';

import { EspecialidadesComponent } from './componentes/seccionAdministrador/especialidades/especialidades.component';
import { SeccionalesComponent } from './componentes/seccionAdministrador/seccionales/seccionales.component';
import { AtencionComponent } from './componentes/seccionProfesional/atencion/atencion.component';
import { HabilitacionesComponent } from './componentes/seccionAdministrador/habilitaciones/habilitaciones.component';
import { PersonalComponent } from './componentes/seccionAdministrador/personal/personal.component';
import { ClientesComponent } from './componentes/seccionAdministrador/clientes/clientes.component';
import { OfertaComponent } from './componentes/estaticos/oferta/oferta.component';
import { ActivacionComponent } from './componentes/estaticos/activacion/activacion.component';

import { NavbarComponent } from './shared/navbar/navbar.component';
import { OlvidecontraComponent } from './componentes/olvidecontra/olvidecontra.component';
import { ContactenosComponent } from './componentes/contactenos/contactenos.component';
import { GestiononlineComponent } from './componentes/gestiononline/gestiononline.component';
import { EstudiosComponent } from './componentes/estudios/estudios.component';
import { ConocermasComponent } from './componentes/conocermas/conocermas.component';

export const routes: Routes = [

    { path: '', redirectTo: 'inicio', pathMatch: 'full' }, //Redirección DEFAULT

    //todos (incluso sin usuario)
    { path: 'inicio', component: InicioComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'ingreso', component: IngresoComponent },
    { path: 'ayuda', component: AyudaComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'oferta', component: OfertaComponent },

    //todos los usuarios
    { path: 'datosPersonales', component: DatosPersonalesComponent },
    { path: 'activarMiUsuario', component: ActivacionComponent },
    
    //seccion paciente
    { path: 'turnosActivos', component: VerTurnosActivosComponent },
    { path: 'turnosDisponibles', component: VerTurnosDisponiblesComponent },

    //seccion profesional
    { path: 'turnosAtencion', component: AtencionComponent },

    //seccion administrador
    { path: 'especialidades', component: EspecialidadesComponent },
    { path: 'seccionales', component: SeccionalesComponent },
    { path: 'personal', component: PersonalComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'habilitaciones', component: HabilitacionesComponent },

    //agregados mios
    {path: 'navbar', component: NavbarComponent},
    {path: 'olvidecontra', component: OlvidecontraComponent},
    {path: 'contactenos', component: ContactenosComponent},
    {path: 'gestiononline', component: GestiononlineComponent},
    {path: 'estudios', component: EstudiosComponent},
    {path: 'conocermas', component: ConocermasComponent},
];
