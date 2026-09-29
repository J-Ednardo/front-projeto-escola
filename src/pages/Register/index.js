import React, { use, useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useSelector, useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';
import axios from '../../services/axios';

export default function Register() {
    const dispatch = useDispatch();
    const id = useSelector(state => state.auth.user.id);
    const nomeStorage = useSelector(state => state.auth.user.nome);
    const emailStorage = useSelector(state => state.auth.user.email);
    const isLoading = useSelector(state => state.auth.isLoading);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    React.useEffect(() => {
        if(!id) return;

        setNome(nomeStorage);
        setEmail(emailStorage);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        let formErros = false;

        if(nome.length < 3 || nome.length > 255) {
            formErros = true;
            toast.error("Nome deve ter entre 3 e 255 caracteres")
        }

        if(!isEmail(email)){
            formErros = true;
            toast.error("Email invalido")
        }

        if(!id && (password.length < 6 || password.length > 50)) {
            formErros = true;
            toast.error("Senha deve ter entre 6 e 50 caracteres")
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
        <Container>
            <Loading isLoading={isLoading} />
            <h1>{id ? 'Minha Conta' : 'Crie sua conta'}</h1>

            <Form onSubmit={handleSubmit}>
                <label  htmlFor='nome'>
                    Nome:
                    <input 
                        type='text' 
                        value={nome} 
                        onChange={e => setNome(e.target.value)}
                        placeholder='Seu nome'
                    />
                </label>

                <label  htmlFor='email'>
                    Email:
                    <input 
                        type='text' 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        placeholder='Seu e-mail'
                    />
                </label>

                <label  htmlFor='password'>
                    Senha:
                    <input 
                        type='password' 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        placeholder='Sua senha'
                    />
                </label>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1 }}>{id ? 'Salvar Alterações' : 'Criar conta'}</button>
                    {id && (
                        <button type="button" onClick={handleDeleteAccount} style={{ background: '#d63031', color: '#fff' }}>
                            Excluir Conta
                        </button>
                    )}
                </div>
            </Form>
        </Container>
    );
}
