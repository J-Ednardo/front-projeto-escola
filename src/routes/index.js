import React from 'react';
import { Switch } from 'react-router-dom';

import MyRoute from './MyRoute';

import Login from '../pages/Login';
import Page404 from '../pages/Page404';
import Aluno from '../pages/Aluno';
import Alunos from '../pages/Alunos';
import Fotos from '../pages/Fotos';
import Register from '../pages/Register';

export default function Routes () {
    return (
        <Switch>
            <MyRoute exact path="/" component={Alunos} isClosed allowedRoles={['ADMIN', 'PROFESSOR']} />
            <MyRoute exact path="/aluno/:id/edit" component={Aluno} isClosed />
            <MyRoute exact path="/aluno/" component={Aluno} isClosed allowedRoles={['ADMIN', 'PROFESSOR']} />
            <MyRoute exact path="/fotos/:id" component={Fotos} isClosed allowedRoles={['ADMIN', 'PROFESSOR']} />           
            <MyRoute exact path="/login/" component={Login} isClosed={false} />
            <MyRoute exact path="/register/" component={Register} isClosed={false} />
            <MyRoute component={Page404}/>
        </Switch>
    );
};
