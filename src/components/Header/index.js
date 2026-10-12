import React from 'react';
import { FaHome, FaSignInAlt, FaUserAlt, FaPowerOff, FaBook, FaUsers, FaGraduationCap, FaCalendarAlt, FaUserShield } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Nav, NavItem, UserBadge } from './styled';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';

export default function Header() {
    const location = useLocation();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const user = useSelector(state => state.auth.user);
    const perfil = user?.perfil;
    const aluno_id = user?.aluno_id;
    const dispatch = useDispatch();

    const handleLogout = e => {
        e.preventDefault();
        dispatch(actions.loginFailure());
        history.push('/');
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <Nav aria-label="Sidebar">
            <Link to="/" className="logo" title="Início">
                <div className="logo-icon">
                    <FaGraduationCap size={24}/>
                </div>
            </Link>

            <div className="nav-items">
                <NavItem to="/" title="Início" aria-label="Início" className={isActive('/') ? 'active' : ''}>
                    <FaHome size={20}/>
                    <span className="tooltip">Início</span>
                </NavItem>

                {perfil === 'ADMIN' && (
                    <>
                    <NavItem to="/disciplinas" title="Disciplinas" aria-label="Disciplinas" className={isActive('/disciplinas') ? 'active' : ''}>
                        <FaBook size={20}/>
                        <span className="tooltip">Disciplinas</span>
                    </NavItem>
                    <NavItem to="/periodos" title="Períodos Letivos" aria-label="Períodos Letivos" className={isActive('/periodos') ? 'active' : ''}>
                        <FaCalendarAlt size={20}/>
                        <span className="tooltip">Períodos</span>
                    </NavItem>
                    <NavItem to="/usuarios" title="Gerenciar Usuários" aria-label="Gerenciar Usuários" className={isActive('/usuarios') ? 'active' : ''}>
                        <FaUserShield size={20}/>
                        <span className="tooltip">Usuários</span>
                    </NavItem>
                    </>
                )}

                {(perfil === 'ADMIN' || perfil === 'PROFESSOR') && (
                    <NavItem to="/turmas" title="Turmas" aria-label="Turmas" className={isActive('/turmas') ? 'active' : ''}>
                        <FaUsers size={20}/>
                        <span className="tooltip">Turmas</span>
                    </NavItem>
                )}

                <NavItem to="/register" title="Perfil" aria-label="Perfil" className={isActive('/register') ? 'active' : ''}>
                    <FaUserAlt size={19}/>
                    <span className="tooltip">Minha Conta</span>
                </NavItem>

                {perfil === 'ALUNO' && (
                    <NavItem to={`/historico/${aluno_id}`} title="Meu Histórico" aria-label="Meu Histórico" className={isActive('/historico') ? 'active' : ''}>
                        <FaBook size={20}/>
                        <span className="tooltip">Meu Histórico</span>
                    </NavItem>
                )}
            </div>
            
            <div className="spacer" style={{ flex: 1 }}></div>

            {isLoggedIn && (
                <UserBadge title={`Conectado como ${user?.nome || 'Usuário'} (${perfil || 'Usuário'})`}>
                    <div className="avatar">
                        {(user?.nome || 'U')[0].toUpperCase()}
                    </div>
                    <span className="role-tag">{perfil || 'USER'}</span>
                </UserBadge>
            )}

            <div className="auth-action">
                {isLoggedIn ? (
                    <NavItem onClick={handleLogout} to="/logout" title="Sair" aria-label="Sair" className="logout-btn">
                        <FaPowerOff size={19}/>
                        <span className="tooltip">Sair</span>
                    </NavItem>
                ): (
                    <NavItem to="/login" title="Entrar" aria-label="Entrar" className={isActive('/login') ? 'active' : ''}>
                        <FaSignInAlt size={20}/>
                        <span className="tooltip">Entrar</span>
                    </NavItem>
                )}
            </div>
        </Nav>
    );
}
