import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { Container } from '../../styles/GlobalStyles';
import { ErrorBox } from './styled';

export default function Page404() {
    return (
        <Container>
            <ErrorBox>
                <div className="error-code">404</div>
                <h1>Essa página não existe</h1>
                <p>O link acessado pode estar desatualizado, ter sido removido ou o endereço digitado está incorreto.</p>
                <Link to="/">
                    <FaHome size={15} /> Voltar para o Início
                </Link>
            </ErrorBox>
        </Container>
    );
}
