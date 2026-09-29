import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from '../../services/axios';
import Chamada from './index';

jest.mock('../../services/axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: '1' }),
}));

describe('Chamada Page', () => {
    beforeEach(() => {
        axios.get.mockClear();
        axios.post.mockClear();
    });

    it('deve carregar e renderizar os alunos e aulas anteriores', async () => {
        axios.get.mockImplementation((url) => {
            if (url === '/matriculas') {
                return Promise.resolve({
                    data: [
                        { id: 1, turma_id: 1, Aluno: { nome: 'João', sobrenome: 'Silva' } }
                    ]
                });
            }
            if (url === '/turmas/1') {
                return Promise.resolve({
                    data: { id: 1, PeriodoLetivo: { status: 'ABERTO' } }
                });
            }
            if (url === '/turmas/1/aulas') {
                return Promise.resolve({
                    data: [
                        { id: 10, data: '2026-09-01', conteudo: 'Introdução' }
                    ]
                });
            }
        });

        render(
            <BrowserRouter>
                <Chamada />
            </BrowserRouter>
        );

        // Espera renderizar o aluno
        const alunoNome = await screen.findByText(/João Silva/i);
        expect(alunoNome).toBeInTheDocument();

        // Espera renderizar a aula anterior
        const aulaConteudo = await screen.findByText(/Introdução/i);
        expect(aulaConteudo).toBeInTheDocument();
    });
});
