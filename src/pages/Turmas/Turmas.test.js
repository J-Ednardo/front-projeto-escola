import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from '../../services/axios';
import Turmas from './index';

jest.mock('../../services/axios');

describe('Turmas Page', () => {
    beforeEach(() => {
        axios.get.mockClear();
        axios.post.mockClear();
    });

    it('deve exibir apenas turmas e períodos de semestres ABERTOS e ocultar os FECHADOS', async () => {
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
                            Disciplina: { id: 1, nome: 'Matemática' }
                        },
                        {
                            id: 2,
                            codigo: 'T-FECHADA',
                            disciplina_id: 1,
                            periodo_id: 2,
                            professor_id: 10,
                            PeriodoLetivo: { id: 2, nome: '2026.1', status: 'FECHADO' },
                            Disciplina: { id: 1, nome: 'Matemática' }
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
                        data: [{ id: 10, nome: 'Carlos', perfil: 'PROFESSOR' }]
                    }
                });
            }
        });

        render(
            <BrowserRouter>
                <Turmas />
            </BrowserRouter>
        );

        // Turma aberta deve aparecer
        const turmaAberta = await screen.findByText(/Turma T-ABERTA/i);
        expect(turmaAberta).toBeInTheDocument();

        // Turma de semestre fechado NÃO deve aparecer
        expect(screen.queryByText(/Turma T-FECHADA/i)).not.toBeInTheDocument();

        // Select de período só deve listar o período ABERTO (2026.2) e não o FECHADO (2026.1)
        const selectPeriodo = screen.getByLabelText(/Período da Turma/i);
        expect(within(selectPeriodo).getByText('2026.2')).toBeInTheDocument();
        expect(within(selectPeriodo).queryByText('2026.1')).not.toBeInTheDocument();
    });
});
