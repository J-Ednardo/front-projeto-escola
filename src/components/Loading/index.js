import React from 'react';
import PropTypes from 'prop-types';
import { Container } from './styled';

export default function Loading({ isLoading }) {
    if(!isLoading) return <></>;

    return (
        <Container role="status" aria-live="polite">
            <div />
            <span className="sr-only">Carregando...</span>
        </Container>
    );
}

Loading.defaultProps = {
    isLoading: false
}

Loading.propTypes = {
    isLoading: PropTypes.bool,
}