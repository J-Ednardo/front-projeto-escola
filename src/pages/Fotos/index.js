import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import { Form, Title } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Fotos({ match }) {
    const dispatch = useDispatch();
    const id = get(match, 'params.id', '');
    
    const [isLoading, setIsLoading] = useState(false);
    const [foto, setFoto] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/alunos/${id}`);
                setFoto(get(data, 'Fotos[0].url', ''));
                setIsLoading(false);
            } catch {
                toast.error('Erro ao obter imagem');
                setIsLoading(false);
                history.push('/');
            }
        };

        getData();
    }, []);

    const handleChange = async e => {
        const file = e.target.files[0];
        const fotoURL = URL.createObjectURL(file);

        setFoto(fotoURL);

        const formData = new FormData();
        formData.append('aluno_id', id);
        formData.append('foto', file);

        try {
            setIsLoading(true);
            
            
            await axios.post('/fotos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                }
            });

            toast.success('Foto enviada com sucesso')
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            const status = get(err, 'response.status', 0);
            
            if (err.customError) {
                const { mensagem, detalhes } = err.customError;
                if (detalhes && detalhes.length > 0) {
                    detalhes.forEach(detalhe => toast.error(`${detalhe.campo}: ${detalhe.mensagem}`));
                } else {
                    toast.error(mensagem);
                }
            } else {
                toast.error('Erro ao enviar foto');
            }

            if(status === 401) dispatch(actions.loginFailure());
        }
    };

    return (
        <Container>
            <Loading isLoading={isLoading}/>
            
            <Title>Fotos</Title>

            <Form>
                <label htmlFor='foto' >
                    {foto ? <img src={foto} alt="Foto" />: 'Selecionar'}
                    <input type='file' id="foto" onChange={handleChange}/>
                </label>
            </Form>
        </Container>
    );
}

Fotos.propTypes = {
    match: PropTypes.shape({}).isRequired,
}
