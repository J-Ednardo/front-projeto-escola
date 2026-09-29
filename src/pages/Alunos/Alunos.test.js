import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import axios from '../../services/axios';
import Alunos from './index';

jest.mock('../../services/axios');

const mockStore = configureStore([]);

describe('Alunos Page', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                user: { perfil: 'ADMIN' },
                isLoggedIn: true
            }
        });

        axios.get.mockClear();
    });

    it('deve carregar e renderizar os botões de paginação quando há mais de uma página', async () => {
        // Mock the API response
        axios.get.mockResolvedValueOnce({
            data: {
                data: [
                    { id: 1, nome: 'Aluno 1', sobrenome: 'Silva', email: 'a1@a.com', Fotos: [] },
                    { id: 2, nome: 'Aluno 2', sobrenome: 'Santos', email: 'a2@a.com', Fotos: [] }
                ],
                meta: { totalPages: 3, page: 1, total: 30 }
            }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Alunos />
                </BrowserRouter>
            </Provider>
        );

        // API is called once
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/alunos', expect.any(Object)));

        // Expect pagination buttons to appear
        const nextButton = await screen.findByText(/Próximo/i);
        expect(nextButton).toBeInTheDocument();

        // Click next
        axios.get.mockResolvedValueOnce({
            data: {
                data: [
                    { id: 3, nome: 'Aluno 3', sobrenome: 'Lima', email: 'a3@a.com', Fotos: [] }
                ],
                meta: { totalPages: 3, page: 2, total: 30 }
            }
        });

        fireEvent.click(nextButton);

        // API should be called again with page=2
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
        expect(axios.get).toHaveBeenLastCalledWith('/alunos', { params: { limit: 10, page: 2 } });
        
        const prevButton = screen.getByText(/Anterior/i);
        expect(prevButton).toBeInTheDocument();
    });
});
