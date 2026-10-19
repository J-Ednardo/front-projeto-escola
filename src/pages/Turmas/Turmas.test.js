import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import axios from '../../services/axios';
import Turmas from './index';

jest.mock('../../services/axios');

const mockStore = configureStore([]);

describe('Turmas Page', () => {
    beforeEach(() => {
        axios.get.mockClear();
        axios.post.mockClear();
    });

    const mockApiResponses = () => {
        axios.get.mockImplementation((url) => {
            if (url === '/turmas') {
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            codigo: 'T-ABERTA',
                            disciplina_id: 1,
                            periodo_id: 1,
                            professor_id: 10,
                            PeriodoLetivo: { id: 1, nome: '2026.2', status: 'ABERTO' },
                            Disciplina: { id: 1, nome: 'Matemática' },
                            Professor: { id: 10, nome: 'Carlos' }
                        },
                        {
                            id: 2,
                            codigo: 'T-FECHADA',
                            disciplina_id: 1,
                            periodo_id: 2,
                            professor_id: 10,
                            PeriodoLetivo: { id: 2, nome: '2026.1', status: 'FECHADO' },
                            Disciplina: { id: 1, nome: 'Matemática' },
                            Professor: { id: 10, nome: 'Carlos' }
                        },
                        {
                            id: 3,
                            codigo: 'T-OUTRO-PROF',
                            disciplina_id: 1,
                            periodo_id: 1,
                            professor_id: 20,
                            PeriodoLetivo: { id: 1, nome: '2026.2', status: 'ABERTO' },
                            Disciplina: { id: 1, nome: 'Matemática' },
                            Professor: { id: 20, nome: 'Ana' }
                        }
                    ]
                });
            }
            if (url === '/disciplinas') {
                return Promise.resolve({
                    data: [{ id: 1, nome: 'Matemática' }]
                });
            }
            if (url === '/periodos-letivos') {
                return Promise.resolve({
                    data: [
                        { id: 1, nome: '2026.2', status: 'ABERTO' },
                        { id: 2, nome: '2026.1', status: 'FECHADO' }
                    ]
                });
            }
            if (url === '/users') {
                return Promise.resolve({
                    data: {
                        data: [
                            { id: 10, nome: 'Carlos', perfil: 'PROFESSOR' },
                            { id: 20, nome: 'Ana', perfil: 'PROFESSOR' }
                        ]
                    }
                });
            }
        });
    };

    it('visão ADMIN: deve exibir formulário de criação e apenas turmas/períodos de semestres ABERTOS', async () => {
        mockApiResponses();
        const store = mockStore({
            auth: {
                user: { id: 1, perfil: 'ADMIN' },
                isLoggedIn: true
            }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Turmas />
                </BrowserRouter>
            </Provider>
        );

        expect(await screen.findByRole('heading', { name: /Gestão de Turmas/i })).toBeInTheDocument();
        expect(screen.getByText(/Cadastrar Nova Turma/i)).toBeInTheDocument();

        // Turmas abertas devem aparecer para o ADMIN
        expect(await screen.findByText(/Turma T-ABERTA/i)).toBeInTheDocument();
        expect(screen.getByText(/Turma T-OUTRO-PROF/i)).toBeInTheDocument();

        // Turma de semestre fechado NÃO deve aparecer
        expect(screen.queryByText(/Turma T-FECHADA/i)).not.toBeInTheDocument();

        // Select de período só deve listar o período ABERTO (2026.2) e não o FECHADO (2026.1)
        const selectPeriodo = screen.getByLabelText(/Período da Turma/i);
        expect(within(selectPeriodo).getByText('2026.2')).toBeInTheDocument();
        expect(within(selectPeriodo).queryByText('2026.1')).not.toBeInTheDocument();
    });

    it('visão PROFESSOR: deve ocultar formulário de criação e exibir apenas Minhas Turmas abertas', async () => {
        mockApiResponses();
        const store = mockStore({
            auth: {
                user: { id: 10, perfil: 'PROFESSOR' },
                isLoggedIn: true
            }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Turmas />
                </BrowserRouter>
            </Provider>
        );

        expect(await screen.findByText(/Minhas Turmas/i)).toBeInTheDocument();
        expect(screen.queryByText(/Cadastrar Nova Turma/i)).not.toBeInTheDocument();

        // Apenas a turma aberta do próprio professor (id 10) deve aparecer
        expect(await screen.findByText(/Turma T-ABERTA/i)).toBeInTheDocument();
        expect(screen.queryByText(/Turma T-OUTRO-PROF/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Turma T-FECHADA/i)).not.toBeInTheDocument();
    });
});
