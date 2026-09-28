import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { isEmail, isInt } from 'validator';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';


export default function Aluno({ match }) {
    const dispatch = useDispatch();
    const id =  get(match, 'params.id', 0);
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [email, setEmail] = useState('');
    const [idade, setIdade] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(!id) return

        async function getData() {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/alunos/${id}`);
                const Foto = get(data, 'Fotos[0].url', '');

                setNome(data.nome);
                setSobrenome(data.sobrenome);
                setEmail(data.email);
                setIdade(data.idade);

                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                const status = get(err, 'response.status', 0);
                const errors = get(err, 'response.data.errors', []);

                if(status == 400) errors.map(error => toast.error(error));
                history.push('/');
            }
        }

        getData();
    }, [id]);

    const handleSubmit = async e => {
        e.preventDefault();
        let formErrors = false;

        if(nome.length < 3 || nome.length > 255) {
            toast.error('Nome precisa ter entre 3 e 255 caracteres');      
            formErrors = true;
        }

        if(sobrenome.length < 3 || sobrenome.length > 255) {
            toast.error('Sobrenome precisa ter entre 3 e 255 caracteres');           
            formErrors = true;
        }

        if(!isEmail(email)) {
            toast.error('E-mail invalido');
            formErrors = true;
        }

        if(!isInt(String(idade))) {
            toast.error('Idade invalida')
            formErrors = true;
        }

        if(formErrors) return;

        try {
            setIsLoading(true);

            if(id) {
                await axios.put(`/alunos/${id}`, {
                    nome,
                    sobrenome,
                    email,
                    idade,
                });

                toast.success('Aluno editado com sucesso');
            } else {
                const { data } = await axios.post(`/alunos/`, {
                    nome,
                    sobrenome,
                    email,
                    idade,
                });

                toast.success('Aluno cadastrado com sucesso');
                history.push(`/aluno/${data.id}/edit`);
            }

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            const status = get(err, 'response.status', 0);
            const data = get(err, 'response.data', {});
            const errors = get(data, 'errors', []);
            

            if(errors.length > 0) {
                errors.map(error => toast.error(error));
            } else {
                toast.error('Erro desconhecido');
            }

            if(status === 401) dispatch(actions.loginFailure());
        }
    }
    
    return (
        <Container>
            <Loading isLoading={isLoading} />

            <h1>{id ? 'Editar aluno' : 'Novo aluno'}</h1>

            <Form onSubmit={handleSubmit}>
                <label>
                    Nome:
                    <input 
                        type="text"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        placeholder='Nome'
                    />
                </label>

                <label>
                    Sobrenome:
                    <input 
                        type="text"
                        value={sobrenome}
                        onChange={e => setSobrenome(e.target.value)}
                        placeholder='Sobrenome'
                    />
                </label>

                <label>
                    E-mail:
                    <input 
                        type="text"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder='E-mail'
                    />
                </label>

                <label>
                    Idade:
                    <input 
                        type="number"
                        value={idade}
                        onChange={e => setIdade(e.target.value)}
                        placeholder='Idade'
                    />
                </label>

                <button type="submit">{id ? 'Editar Aluno' : 'Cadastrar Aluno'}</button>
            </Form>
        </Container>
    );
}

Aluno.propTypes = {
    match: PropTypes.shape({}).isRequired,
}
