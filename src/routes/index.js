import React from 'react';
import { Switch } from 'react-router-dom';

import MyRoute from './MyRoute';

import Login from '../pages/Login';
import Page404 from '../pages/Page404';
import Aluno from '../pages/Aluno';
import Alunos from '../pages/Alunos';
import Fotos from '../pages/Fotos';
import Register from '../pages/Register';
import Boletim from '../pages/Boletim';
import Disciplinas from '../pages/Disciplinas';
import Turmas from '../pages/Turmas';
import DiarioTurma from '../pages/DiarioTurma';
import Chamada from '../pages/Chamada';
import Periodos from '../pages/Periodos';
import Historico from '../pages/Historico';

export default function Routes () {
    return (
        <Switch>
            <MyRoute exact path="/" component={Alunos} isClosed allowedRoles={['ADMIN', 'PROFESSOR']} />
            <MyRoute exact path="/aluno/:id/edit" component={Aluno} isClosed />
            <MyRoute exact path="/aluno/" component={Aluno} isClosed allowedRoles={['ADMIN', 'PROFESSOR']} />
            <MyRoute exact path="/fotos/:id" component={Fotos} isClosed allowedRoles={['ADMIN', 'PROFESSOR']} />
            
            <MyRoute exact path="/boletim/:id?" component={Boletim} isClosed />
            <MyRoute exact path="/disciplinas" component={Disciplinas} isClosed allowedRoles={['ADMIN']} />
            <MyRoute exact path="/periodos" component={Periodos} isClosed allowedRoles={['ADMIN']} />
            <MyRoute exact path="/turmas" component={Turmas} isClosed allowedRoles={['ADMIN', 'PROFESSOR']} />
            <MyRoute exact path="/turmas/:id/matriculas" component={DiarioTurma} isClosed allowedRoles={['ADMIN', 'PROFESSOR']} />
            <MyRoute exact path="/turmas/:id/chamada" component={Chamada} isClosed allowedRoles={['ADMIN', 'PROFESSOR']} />
            <MyRoute exact path="/historico/:id" component={Historico} isClosed allowedRoles={['ADMIN', 'PROFESSOR', 'ALUNO']} />

            <MyRoute exact path="/login/" component={Login} isClosed={false} />
            <MyRoute exact path="/register/" component={Register} isClosed={false} />
            <MyRoute component={Page404}/>
        </Switch>
    );
};
