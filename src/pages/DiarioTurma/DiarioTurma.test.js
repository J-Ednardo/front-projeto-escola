import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { toast } from 'react-toastify';
import axios from '../../services/axios';
import DiarioTurma from './index';

jest.mock('../../services/axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: '1' }),
}));

const mockStore = configureStore([]);

describe('DiarioTurma Page', () => {
    beforeEach(() => {
        axios.get.mockClear();
        axios.post.mockClear();
        axios.put.mockClear();
        axios.delete.mockClear();
        jest.restoreAllMocks();
    });

    const mockApiData = () => {
        axios.get.mockImplementation((url) => {
            if (url === '/matriculas') {
                return Promise.resolve({
                    data: [
                        {
                            id: 10,
                            turma_id: 1,
                            aluno_id: 100,
                            nota1: 7.0,
                            nota2: null,
                            nota3: null,
                            nota_recuperacao: null,
                            media_final: null,
                            situacao: 'Cursando',
                            Aluno: { id: 100, nome: 'João', sobrenome: 'Silva' },
                            Frequencias: []
                        }
                    ]
                });
            }
            if (url === '/alunos') {
                return Promise.resolve({
                    data: {
                        data: [
                            { id: 100, nome: 'João', sobrenome: 'Silva' },
                            { id: 101, nome: 'Maria', sobrenome: 'Oliveira' }
                        ]
                    }
                });
            }
            if (url === '/turmas/1') {
                return Promise.resolve({
                    data: {
                        id: 1,
                        codigo: 'T-MAT-01',
                        Disciplina: { id: 1, nome: 'Matemática' },
                        PeriodoLetivo: { id: 1, nome: '2026.2', status: 'ABERTO' },
                        Professor: { id: 10, nome: 'Carlos' }
                    }
                });
            }
            return Promise.resolve({ data: [] });
        });
    };

    it('visão PROFESSOR: deve renderizar alunos matriculados, ocultar matrícula/remoção e permitir salvar notas válidas (0 a 10)', async () => {
        mockApiData();
        axios.put.mockResolvedValueOnce({
            data: { id: 10, nota1: 8.5, situacao: 'Cursando' }
        });

        const store = mockStore({
            auth: {
                user: { id: 10, perfil: 'PROFESSOR' },
                isLoggedIn: true
            }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiarioTurma />
                </BrowserRouter>
            </Provider>
        );

        expect(await screen.findByText('João Silva')).toBeInTheDocument();

        expect(screen.queryByRole('button', { name: /Matricular Aluno/i })).not.toBeInTheDocument();
        expect(screen.queryByTitle(/Remover matrícula do aluno/i)).not.toBeInTheDocument();

        const gradeInputs = screen.getAllByRole('spinbutton');
        fireEvent.change(gradeInputs[0], { target: { value: '8.5' } });
        fireEvent.blur(gradeInputs[0], { target: { value: '8.5' } });

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/matriculas/10', { nota1: '8.5' });
        });
    });

    it('validação de notas (0 a 10): não deve chamar axios.put ao digitar nota inválida (ex.: 15)', async () => {
        mockApiData();
        const toastErrorSpy = jest.spyOn(toast, 'error').mockImplementation(() => {});

        const store = mockStore({
            auth: {
                user: { id: 10, perfil: 'PROFESSOR' },
                isLoggedIn: true
            }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiarioTurma />
                </BrowserRouter>
            </Provider>
        );

        expect(await screen.findByText('João Silva')).toBeInTheDocument();

        const gradeInputs = screen.getAllByRole('spinbutton');
        fireEvent.change(gradeInputs[0], { target: { value: '15' } });
        fireEvent.blur(gradeInputs[0], { target: { value: '15' } });

        expect(axios.put).not.toHaveBeenCalled();
        expect(toastErrorSpy).toHaveBeenCalledWith('A nota deve ser um valor entre 0 e 10.');
    });

    it('visão ADMIN: deve exibir formulário de matrícula filtrando alunos já matriculados e permitir remover matrícula', async () => {
        mockApiData();
        axios.delete.mockResolvedValueOnce({ data: {} });
        jest.spyOn(window, 'confirm').mockReturnValue(true);

        const store = mockStore({
            auth: {
                user: { id: 1, perfil: 'ADMIN' },
                isLoggedIn: true
            }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiarioTurma />
                </BrowserRouter>
            </Provider>
        );

        expect(await screen.findByText('João Silva')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Matricular Aluno/i })).toBeInTheDocument();

        const selectAluno = screen.getByRole('combobox');
        expect(within(selectAluno).getByText('Maria Oliveira')).toBeInTheDocument();
        expect(within(selectAluno).queryByText('João Silva')).not.toBeInTheDocument();

        const btnRemover = screen.getByTitle(/Remover matrícula do aluno/i);
        fireEvent.click(btnRemover);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith('/matriculas/10');
        });
    });
});
