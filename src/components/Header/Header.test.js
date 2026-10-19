import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Header from './index';

const mockStore = configureStore([]);

describe('Header Component - Perfis de Navegação', () => {
    it('deve exibir badge ADMIN e links administrativos (Períodos Letivos, Disciplinas, Turmas e Usuários) para perfil ADMIN', () => {
        const store = mockStore({
            auth: {
                isLoggedIn: true,
                user: { id: 1, nome: 'Secretaria', perfil: 'ADMIN' },
            },
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText('ADMIN')).toBeInTheDocument();
        expect(screen.getByLabelText('Períodos Letivos')).toBeInTheDocument();
        expect(screen.getByLabelText('Disciplinas')).toBeInTheDocument();
        expect(screen.getByLabelText('Turmas')).toBeInTheDocument();
        expect(screen.getByLabelText('Gerenciar Usuários')).toBeInTheDocument();
    });

    it('deve exibir badge DOCENTE e link Minhas Turmas para perfil PROFESSOR, ocultando Períodos Letivos, Disciplinas e Usuários', () => {
        const store = mockStore({
            auth: {
                isLoggedIn: true,
                user: { id: 2, nome: 'Roberto', perfil: 'PROFESSOR' },
            },
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText(/Docente/i)).toBeInTheDocument();
        expect(screen.getByTitle('Minhas Turmas')).toBeInTheDocument();
        expect(screen.getByText('Minhas Turmas')).toBeInTheDocument();

        expect(screen.queryByLabelText('Períodos Letivos')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Disciplinas')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Gerenciar Usuários')).not.toBeInTheDocument();
    });

    it('deve exibir badge ALUNO e link Meu Boletim apontando para /boletim/5 para perfil ALUNO (aluno_id: 5), ocultando menus administrativos e docentes', () => {
        const store = mockStore({
            auth: {
                isLoggedIn: true,
                user: { id: 3, nome: 'Lucas', perfil: 'ALUNO', aluno_id: 5 },
            },
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText('ALUNO')).toBeInTheDocument();

        const boletimLink = screen.getByLabelText('Meu Boletim');
        expect(boletimLink).toBeInTheDocument();
        expect(boletimLink).toHaveAttribute('href', '/boletim/5');

        const historicoLink = screen.getByLabelText('Meu Histórico');
        expect(historicoLink).toBeInTheDocument();
        expect(historicoLink).toHaveAttribute('href', '/historico/5');

        expect(screen.queryByLabelText('Períodos Letivos')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Disciplinas')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Gerenciar Usuários')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Turmas')).not.toBeInTheDocument();
    });
});
