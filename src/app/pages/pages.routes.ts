import { Routes } from '@angular/router';

import { UsuarioComponent } from './usuario/usuario.component';
import { ElasticidaComponent } from './elasticida/elasticida.component';
import { NutricionaleComponent } from './nutricionale/nutricionale.component';
import { AntropometricaComponent } from './antropometrica/antropometrica.component';
import { EntrenadorComponent } from './entrenador/entrenador.component';
import { PsicologoComponent } from './psicologo/psicologo.component';
import { MedicoComponent } from './medico/medico.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { PagoComponent } from './pago/pago.component';
import { RepresentanteService } from './service/representante.service';
import { RepresentanteComponent } from './representante/representante.component';
import { RepresentantenadadorComponent } from './representantenadador/representantenadador.component';
import { TorneoComponent } from './torneo/torneo.component';
import { CategoriadistanciaComponent } from './categoriadistancia/categoriadistancia.component';
import { TorneonadoComponent } from './torneonado/torneonado.component';
import { TiemponadadorComponent } from './tiemponadador/tiemponadador.component';

export default [
    { path: 'usuario', component: UsuarioComponent },
    { path: 'entrenador', component: EntrenadorComponent },
    { path: 'elasticida', component: ElasticidaComponent },
    { path: 'nutricionales', component: NutricionaleComponent },
    { path: 'antropometrica', component: AntropometricaComponent },
    { path: 'psicologo', component: PsicologoComponent },
    { path: 'medico', component: MedicoComponent },
    { path: 'asistencia', component: AsistenciaComponent },
    { path: 'pago', component: PagoComponent },
    { path: 'representante', component: RepresentanteComponent },
    { path: 'representantenadador', component: RepresentantenadadorComponent },
    { path: 'torneo', component: TorneoComponent },
    { path: 'categoriaDistancia', component: CategoriadistanciaComponent },
    { path: 'torneoNado', component: TorneonadoComponent },
    { path: 'tiempoNadador', component: TiemponadadorComponent },
    
    { path: '**', redirectTo: '/notfound' }
] as Routes;
