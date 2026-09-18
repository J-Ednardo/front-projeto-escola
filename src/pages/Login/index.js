import React from 'react';
import { useDispatch } from 'react-redux';

import { Paragrafo, Title } from './styled';
import { Container } from '../../styles/GlobalStyles';
import * as exampleActions from '../../store/modules/example/actions';

export default function Login() {
    const dispatch = useDispatch();
   
    const handleClick = (e) => {
        e.preventDefault();

        dispatch(exampleActions.clicaBotaoRequest()); 
    }
    
    return (
        <Container>
            <Title>
                Login
                <small>Oie</small>
            </Title>
            <Paragrafo>Lorem ipsum dolor sit amet.</Paragrafo>
            <button type="button" onClick={handleClick}>Enviar</button>
        </Container>
    );
}
