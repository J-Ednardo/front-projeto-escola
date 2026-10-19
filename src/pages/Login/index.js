import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import { FaGraduationCap, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { AuthWrapper, AuthCard, Form, InputGroup } from './styled';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';

export default function Login(props) {
    const dispatch = useDispatch();

    const prevPath = get(props, 'location.state.prevPath', '/');

    const isLoading = useSelector(state => state.auth.isLoading);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        let formErrors = false;

        if(!isEmail(email)) {
            formErrors = true;
            toast.error("E-mail inválido");
        }

        if(password.length < 6 || password.length > 50) {
            formErrors = true;
            toast.error("Senha inválida");
        }

        if(formErrors) return;

        dispatch(actions.loginRequest({
            email,
            password,
            prevPath
        }));
    };
    
    return (
        <AuthWrapper>
            <Loading isLoading={isLoading} />
            
            <AuthCard>
                <div className="card-header">
                    <div className="brand-badge">
                        <FaGraduationCap size={28} />
                    </div>
                    <h1>Login</h1>
                    <p className="subtitle">Entre com suas credenciais para acessar o portal acadêmico</p>
                </div>

                <Form onSubmit={handleSubmit}>
                    <label>
                        E-mail
                        <InputGroup>
                            <FaEnvelope className="input-icon" />
                            <input 
                                type='text' 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                placeholder='Seu e-mail cadastrado'
                                autoFocus
                            />
                        </InputGroup>
                    </label>            

                    <label>
                        Senha
                        <InputGroup>
                            <FaLock className="input-icon" />
                            <input 
                                type='password' 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                placeholder='Sua senha de acesso'
                            />
                        </InputGroup>
                    </label>      

                    <button type='submit' disabled={isLoading}>
                        {isLoading ? 'Entrando...' : 'Entrar no Sistema'}
                    </button>
                </Form>

                <div className="card-footer">
                    <span>Não tem uma conta?</span>
                    <Link to="/register">Crie sua conta</Link>
                </div>
            </AuthCard>
        </AuthWrapper>
    );
}
