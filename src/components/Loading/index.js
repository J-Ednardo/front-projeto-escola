import React from 'react';
import PropTypes from 'prop-types';
import { Container, Spinner } from './styled';

export default function Loading({ isLoading }) {
    if(!isLoading) return <></>;

    return (
        <Container role="status" aria-live="polite">
            <div className="backdrop" />
            <div className="content">
                <Spinner viewBox="0 0 50 50">
                    <circle
                        className="path"
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="4"
                    />
                </Spinner>
                <span className="sr-only">Carregando...</span>
            </div>
        </Container>
    );
}

Loading.defaultProps = {
    isLoading: false
}

Loading.propTypes = {
    isLoading: PropTypes.bool,
}