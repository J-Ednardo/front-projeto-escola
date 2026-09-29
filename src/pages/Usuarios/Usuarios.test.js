import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from '../../services/axios';
import Usuarios from './index';

jest.mock('../../services/axios');

describe('Usuarios Page', () => {
    beforeEach(() => {
        axios.get.mockClear();
    });

    it('deve carregar e renderizar a lista de usuários', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                data: [
                    { id: 1, nome: 'Admin Test', email: 'admin@test.com', perfil: 'ADMIN', aluno_id: null }
                ],
                meta: { totalPages: 1 }
            }
        });

        render(
            <BrowserRouter>
                <Usuarios />
            </BrowserRouter>
        );

        const userName = await screen.findByText(/Admin Test/i);
        expect(userName).toBeInTheDocument();
        
        const role = screen.getByText('ADMIN');
        expect(role).toBeInTheDocument();
    });
});
