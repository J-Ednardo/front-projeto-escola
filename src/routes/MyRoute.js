import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Container } from '../styles/GlobalStyles';

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
            if (user.perfil === 'ALUNO') {
                if (user.aluno_id) {
                    return <Redirect to={`/historico/${user.aluno_id}`} />;
                }
            }
            // Fallback genérico para quem não tem acesso
            return (
                <Container>
                    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                        <h2>Acesso Restrito</h2>
                        <p style={{ marginTop: '15px' }}>Você não tem permissão para acessar esta página.</p>
                        <p style={{ marginTop: '10px' }}>Seu perfil atual é <strong>{user.perfil || 'Não definido'}</strong>.</p>
                        <p style={{ marginTop: '10px' }}>Aguarde um administrador configurar seu acesso ou vincular seu cadastro de aluno.</p>
                    </div>
                </Container>
            );
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