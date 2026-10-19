import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import axios from '../../services/axios';
import Boletim from './index';

jest.mock('../../services/axios');
jest.mock('jspdf', () => ({
    jsPDF: jest.fn(() => ({
        setFontSize: jest.fn(),
        text: jest.fn(),
        save: jest.fn(),
    })),
}));
jest.mock('jspdf-autotable', () => jest.fn());

const mockStore = configureStore([]);

describe('Boletim Page', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                user: { id: 1, nome: 'Lucas', perfil: 'ALUNO', aluno_id: 1 },
                isLoggedIn: true,
            },
        });

        axios.get.mockClear();
    });

    it('deve carregar e exibir os dados do aluno e suas matrículas com disciplina, notas, faltas e situação', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                id: 1,
                nome: 'Lucas',
                sobrenome: 'Pereira',
                email: 'lucas@escola.com',
                Fotos: [],
                Matriculas: [
                    {
                        id: 10,
                        nota1: 8.5,
                        nota2: 9.0,
                        nota3: 7.5,
                        nota_recuperacao: null,
                        media_final: 8.3,
                        faltas_legado: 2,
                        Frequencias: [{ presente: false }, { presente: true }],
                        situacao: 'Aprovado',
                        Turma: {
                            codigo: 'T01',
                            Disciplina: {
                                nome: 'Matemática Aplicada',
                            },
                        },
                    },
                ],
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/boletim/1']}>
                    <Route path="/boletim/:id">
                        <Boletim />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/alunos/1'));

        expect(await screen.findByRole('heading', { name: /Boletim: Lucas Pereira/i })).toBeInTheDocument();
        expect(screen.getByText(/lucas@escola\.com/i)).toBeInTheDocument();
        expect(screen.getByText('Matemática Aplicada')).toBeInTheDocument();
        expect(screen.getByText('Turma T01')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('8.5')).toBeInTheDocument();
        expect(screen.getByText('9')).toBeInTheDocument();
        expect(screen.getByText('7.5')).toBeInTheDocument();
        expect(screen.getByText('8.3')).toBeInTheDocument();
        expect(screen.getByText('Aprovado')).toBeInTheDocument();
    });

    it('deve exibir mensagem de estado vazio quando o aluno não possui matrículas', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                id: 1,
                nome: 'Lucas',
                sobrenome: 'Pereira',
                email: 'lucas@escola.com',
                Fotos: [],
                Matriculas: [],
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/boletim/1']}>
                    <Route path="/boletim/:id">
                        <Boletim />
                    </Route>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/alunos/1'));

        expect(await screen.findByText(/Nenhuma matrícula encontrada\./i)).toBeInTheDocument();
        expect(screen.getByText(/Matrículas ativas: 0/i)).toBeInTheDocument();
    });
});
