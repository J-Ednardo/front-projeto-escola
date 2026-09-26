import React, { use, useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { get } from 'lodash';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import Loading from '../../components/Loading';

export default function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

        if(password.length < 6 || password.length > 50) {
            formErros = true;
            toast.error("Senha deve ter entre 6 e 50 caracteres")
        }

        if(formErros) return;

        setIsLoading(true);

        try {
            await axios.post('/users/', {
                nome, 
                password, 
                email,
            });
            toast.success('Você fez seu cadastro');
            setIsLoading(false);
            history.push('/login');
        } catch (err) {
            const errors = get(err, 'response.data.errors', []);
            errors.map(error => toast.error(error));
            setIsLoading(false);
        }
    }
    
    return (
        <Container>
            <Loading isLoading={isLoading} />
            <h1>Crie sua conta</h1>

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
                        type='text' 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        placeholder='Sua senha'
                    />
                </label>

                <button type="submit">Criar conta</button>
            </Form>
        </Container>
    );
}
