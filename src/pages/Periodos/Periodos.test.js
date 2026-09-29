import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from '../../services/axios';
import Periodos from './index';

jest.mock('../../services/axios');

describe('Periodos Page', () => {
    beforeEach(() => {
        axios.get.mockClear();
    });

    it('deve carregar e renderizar os periodos', async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, nome: '2026.1', status: 'ABERTO' }
            ]
        });

        render(
            <BrowserRouter>
                <Periodos />
            </BrowserRouter>
        );

        const periodoNome = await screen.findByText(/2026\.1/i);
        expect(periodoNome).toBeInTheDocument();
        
        const status = screen.getByText(/ABERTO/i);
        expect(status).toBeInTheDocument();
    });
});
