import React from 'react';
import { FaHome, FaSignInAlt, FaUserAlt, FaCircle, FaPowerOff, FaBook, FaUsers } from 'react-icons/fa';
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
        <Nav>
            <Link to="/" title="Início">
                <FaHome size={24}/>
            </Link>

            {perfil === 'ADMIN' && (
                <>
                <Link to="/disciplinas" title="Disciplinas">
                    <FaBook size={24}/>                
                </Link>
                <Link to="/periodos" title="Períodos Letivos" style={{marginLeft: '15px'}}>
                    Semestres
                </Link>
                </>
            )}

            {(perfil === 'ADMIN' || perfil === 'PROFESSOR') && (
                <Link to="/turmas" title="Turmas">
                    <FaUsers size={24}/>                
                </Link>
            )}

            <Link to="/register" title="Perfil">
                <FaUserAlt size={24}/>                
            </Link>

            {perfil === 'ALUNO' && (
                <Link to={`/historico/${useSelector(state => state.auth.user?.aluno_id)}`} title="Meu Histórico" style={{marginLeft: '15px', color: '#fff'}}>
                    <FaBook size={24}/> Meu Histórico
                </Link>
            )}
            
            {isLoggedIn ? (
                <Link onClick={handleLogout} to="/logout" title="Sair">
                    <FaPowerOff size={24}/>
                </Link>
            ): (
                <Link to="/login" title="Entrar">
                    <FaSignInAlt size={24}/>
                </Link>
            )}

            {isLoggedIn &&  <FaCircle size={24} color='#66ff33' />}
        </Nav>
    );
}
