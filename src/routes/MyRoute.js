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
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px 24px', 
                        maxWidth: '520px', 
                        margin: '0 auto',
                        background: '#F8FAFC',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0'
                    }}>
                        <h2 style={{ fontSize: '20px', color: '#0F172A', marginBottom: '12px' }}>Acesso Restrito</h2>
                        <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
                            Você não tem permissão para acessar esta página com suas credenciais atuais.
                        </p>
                        <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>
                            Seu perfil cadastrado: <span style={{ 
                                display: 'inline-block',
                                background: '#EFF6FF', 
                                color: '#2563EB', 
                                padding: '2px 8px', 
                                borderRadius: '4px', 
                                fontWeight: 700,
                                fontSize: '12px'
                            }}>{user.perfil || 'Não definido'}</span>
                        </p>
                        <p style={{ color: '#94A3B8', fontSize: '13px' }}>
                            Aguarde a coordenação configurar suas permissões ou vincular seu cadastro discente.
                        </p>
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