import React from 'react';
import { FaHome, FaSignInAlt, FaUserAlt, FaCircle, FaPowerOff, FaBook, FaUsers, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Nav } from './styled';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';

export default function Header() {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const perfil = useSelector(state => state.auth.user?.perfil);
    const dispatch = useDispatch();

    const handleLogout = e => {
        e.preventDefault();
        dispatch(actions.loginFailure());
        history.push('/');
    }

    return (
        <Nav aria-label="Sidebar">
            <Link to="/" className="logo" title="Início">
                <FaGraduationCap size={32}/>
            </Link>

            <Link to="/" title="Início" aria-label="Início">
                <FaHome size={24}/>
            </Link>

            {perfil === 'ADMIN' && (
                <>
                <Link to="/disciplinas" title="Disciplinas" aria-label="Disciplinas">
                    <FaBook size={24}/>                
                </Link>
                <Link to="/periodos" title="Períodos Letivos" aria-label="Períodos Letivos">
                    <FaCalendarAlt size={24}/>
                </Link>
                </>
            )}

            {(perfil === 'ADMIN' || perfil === 'PROFESSOR') && (
                <Link to="/turmas" title="Turmas" aria-label="Turmas">
                    <FaUsers size={24}/>                
                </Link>
            )}

            <Link to="/register" title="Perfil" aria-label="Perfil">
                <FaUserAlt size={24}/>                
            </Link>

            {perfil === 'ALUNO' && (
                <Link to={`/historico/${useSelector(state => state.auth.user?.aluno_id)}`} title="Meu Histórico" aria-label="Meu Histórico">
                    <FaBook size={24}/>
                </Link>
            )}
            
            <div style={{ flex: 1 }}></div>

            {isLoggedIn ? (
                <Link onClick={handleLogout} to="/logout" title="Sair" aria-label="Sair">
                    <FaPowerOff size={24}/>
                </Link>
            ): (
                <Link to="/login" title="Entrar" aria-label="Entrar">
                    <FaSignInAlt size={24}/>
                </Link>
            )}

            {isLoggedIn &&  <FaCircle size={12} color='#00B894' style={{ marginBottom: '20px' }} />}
        </Nav>
    );
}
