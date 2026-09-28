import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function MyRoute({ component: Component, isClosed, allowedRoles, ...rest }) {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const user = useSelector(state => state.auth.user);

    if(isClosed && !isLoggedIn) {
        return (
            <Redirect 
                to={{ 
                    pathname: '/login', 
                    state: {prevPath: rest.location.pathname} 
                }}
            />
        );
    }

    if (allowedRoles && isLoggedIn) {
        if (!allowedRoles.includes(user.perfil)) {
            // Se for ALUNO tentando acessar rota que não pode, joga pra edição dele
            if (user.perfil === 'ALUNO' && user.aluno_id) {
                return <Redirect to={`/boletim`} />;
            }
            // Fallback genérico para quem não tem acesso
            return <Redirect to="/" />;
        }
    }

    return <Route {...rest } component={Component} />;
};

MyRoute.defaultProps = {
    isClosed: false,
};

MyRoute.propTypes = {
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    isClosed: PropTypes.bool
};