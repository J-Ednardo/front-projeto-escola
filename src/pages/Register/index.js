import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { RegisterWrapper, Card, Form, InputGroup, ActionRow } from './styled';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';
import axios from '../../services/axios';

export default function Register() {
    const dispatch = useDispatch();
    const id = useSelector(state => state.auth.user?.id);
    const perfil = useSelector(state => state.auth.user?.perfil);
    const nomeStorage = useSelector(state => state.auth.user?.nome);
    const emailStorage = useSelector(state => state.auth.user?.email);
    const isLoading = useSelector(state => state.auth.isLoading);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if(!id) return;
        setNome(nomeStorage || '');
        setEmail(emailStorage || '');
    }, [id, nomeStorage, emailStorage]);

    async function handleSubmit(e) {
        e.preventDefault();
        let formErros = false;

        if(nome.length < 3 || nome.length > 255) {
            formErros = true;
            toast.error("Nome deve ter entre 3 e 255 caracteres");
        }

        if(!isEmail(email)){
            formErros = true;
            toast.error("Email inválido");
        }

        if(!id && (password.length < 6 || password.length > 50)) {
            formErros = true;
            toast.error("Senha deve ter entre 6 e 50 caracteres");
        }

        if(formErros) return;

        dispatch(actions.registerRequest({ nome, email, password, id }));
    }

    async function handleDeleteAccount() {
        if (!window.confirm('Tem certeza que deseja EXCLUIR sua conta? Esta ação não pode ser desfeita.')) return;
        
        try {
            await axios.delete('/users');
            toast.success('Conta excluída com sucesso.');
            dispatch(actions.loginFailure());
        } catch (e) {
            toast.error('Erro ao excluir conta.');
        }
    }
    
    return (
        <RegisterWrapper>
            <Loading isLoading={isLoading} />
            
            <Card>
                <div className="card-header">
                    <div className="brand-badge">
                        <FaUserShield size={26} />
                    </div>
                    <h1>{id ? 'Minha Conta' : 'Crie sua conta'}</h1>
                    <p className="subtitle">
                        {id 
                            ? `Gerencie suas credenciais de acesso (${perfil || 'Usuário'})`
                            : 'Cadastre-se para obter acesso ao portal acadêmico'
                        }
                    </p>
                </div>

                <Form onSubmit={handleSubmit}>
                    <label htmlFor='nome'>
                        Nome Completo
                        <InputGroup>
                            <FaUser className="input-icon" />
                            <input 
                                id='nome'
                                type='text' 
                                value={nome} 
                                onChange={e => setNome(e.target.value)}
                                placeholder='Seu nome completo'
                                required
                            />
                        </InputGroup>
                    </label>

                    <label htmlFor='email'>
                        Endereço de E-mail
                        <InputGroup>
                            <FaEnvelope className="input-icon" />
                            <input 
                                id='email'
                                type='email' 
                                value={email} 
                                onChange={e => setEmail(e.target.value)}
                                placeholder='exemplo@escola.com'
                                required
                            />
                        </InputGroup>
                    </label>

                    <label htmlFor='password'>
                        {id ? 'Nova Senha (deixe em branco para manter)' : 'Senha de Acesso'}
                        <InputGroup>
                            <FaLock className="input-icon" />
                            <input 
                                id='password'
                                type='password' 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                placeholder={id ? 'Digite nova senha se desejar alterar' : 'Mínimo de 6 caracteres'}
                                required={!id}
                            />
                        </InputGroup>
                    </label>

                    <ActionRow>
                        <button type="submit" disabled={isLoading}>
                            {id ? 'Salvar Alterações' : 'Criar conta'}
                        </button>
                        {id && (
                            <button 
                                type="button" 
                                onClick={handleDeleteAccount} 
                                className="danger-btn"
                                title="Excluir minha conta permanentemente"
                            >
                                <FaTrashAlt size={14} /> Excluir Conta
                            </button>
                        )}
                    </ActionRow>
                </Form>

                {!id && (
                    <div className="card-footer">
                        <span>Já tem uma conta cadastrada?</span>
                        <Link to="/login">Fazer Login</Link>
                    </div>
                )}
            </Card>
        </RegisterWrapper>
    );
}
