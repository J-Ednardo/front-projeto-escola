import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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
        axios.put.mockClear();
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

    it('deve exibir aviso e desabilitar botão de salvar se a data da aula já estiver registrada', async () => {
        const todayStr = new Date().toISOString().split('T')[0];

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
                        { id: 10, data: todayStr, conteudo: 'Aula de Hoje' }
                    ]
                });
            }
        });

        render(
            <BrowserRouter>
                <Chamada />
            </BrowserRouter>
        );

        // Deve exibir o aviso de chamada já registrada
        const alertMsg = await screen.findByText(/Já existe uma aula\/chamada registrada para a data/i);
        expect(alertMsg).toBeInTheDocument();

        // O botão deve estar desabilitado
        const saveBtn = screen.getByRole('button', { name: /Chamada Já Registrada Nesta Data/i });
        expect(saveBtn).toBeDisabled();
    });

    it('deve permitir expandir uma aula anterior e retificar a presença de um aluno', async () => {
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
                        {
                            id: 10,
                            data: '2026-09-01',
                            conteudo: 'Introdução',
                            Frequencias: [{ id: 99, matricula_id: 1, presente: true }]
                        }
                    ]
                });
            }
        });
        axios.put.mockResolvedValueOnce({ data: { id: 99, presente: false } });

        render(
            <BrowserRouter>
                <Chamada />
            </BrowserRouter>
        );

        const verChamadaBtn = await screen.findByRole('button', { name: /Ver.*Chamada/i });
        fireEvent.click(verChamadaBtn);

        const alunoExpandido = await screen.findByText(/↳.*João Silva/i);
        expect(alunoExpandido).toBeInTheDocument();

        const rowExpandida = alunoExpandido.closest('tr');
        const toggleBtn = within(rowExpandida).getByRole('button', { name: /Presente/i });
        fireEvent.click(toggleBtn);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/frequencias/99', { presente: false });
        });
    });
});

