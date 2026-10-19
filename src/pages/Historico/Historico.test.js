import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import axios from '../../services/axios';
import Historico from './index';

jest.mock('../../services/axios');

const mockStore = configureStore([]);

describe('Historico Page', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                user: { id: 1, nome: 'Mariana', perfil: 'ALUNO', aluno_id: 1 },
                isLoggedIn: true,
            },
        });

        axios.get.mockClear();
    });

    it('deve carregar e exibir o histórico escolar com CR, carga horária integralizada e disciplinas agrupadas por período letivo', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                aluno: {
                    id: 1,
                    nome: 'Mariana',
                    sobrenome: 'Costa',
                },
                estatisticas: {
                    carga_horaria_integralizada: 120,
                    coeficiente_rendimento: 8.75,
                },
                periodos: {
                    '2025.1': [
                        {
                            disciplina: 'Engenharia de Software',
                            carga_horaria: 60,
                            media_final: 9.0,
                            faltas: 2,
                            situacao: 'Aprovado',
                        },
                        {
                            disciplina: 'Banco de Dados',
                            carga_horaria: 60,
                            media_final: 8.5,
                            faltas: 0,
                            situacao: 'Aprovado',
                        },
                    ],
                },
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/historico/1']}>
                    <Route path="/historico/:id">
                        <Historico />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/alunos/1/historico'));

        expect(await screen.findByRole('heading', { name: /Histórico Escolar Oficial/i })).toBeInTheDocument();
        expect(screen.getByText('Mariana Costa')).toBeInTheDocument();
        expect(screen.getByText('120h')).toBeInTheDocument();
        expect(screen.getByText('8.75')).toBeInTheDocument();
        expect(screen.getByText(/Período Letivo: 2025\.1/i)).toBeInTheDocument();
        expect(screen.getByText('2 disciplinas')).toBeInTheDocument();
        expect(screen.getByText('Engenharia de Software')).toBeInTheDocument();
        expect(screen.getByText('Banco de Dados')).toBeInTheDocument();
        expect(screen.getAllByText('Aprovado')).toHaveLength(2);
    });

    it('deve exibir estado vazio quando o aluno não possui períodos consolidados no histórico', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                aluno: {
                    id: 1,
                    nome: 'Mariana',
                    sobrenome: 'Costa',
                },
                estatisticas: {
                    carga_horaria_integralizada: 0,
                    coeficiente_rendimento: 0,
                },
                periodos: {},
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/historico/1']}>
                    <Route path="/historico/:id">
                        <Historico />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/alunos/1/historico'));

        expect(await screen.findByText(/Nenhum registro encontrado/i)).toBeInTheDocument();
    });
});
