import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import axios from '../../services/axios';
import Disciplinas from './index';

jest.mock('../../services/axios');

const mockStore = configureStore([]);

describe('Disciplinas Page', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                user: { id: 1, perfil: 'ADMIN' },
                isLoggedIn: true
            }
        });

        axios.get.mockClear();
        axios.post.mockClear();
        axios.put.mockClear();
        axios.delete.mockClear();
        jest.spyOn(window, 'confirm').mockImplementation(() => true);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('deve listar as disciplinas retornadas por GET /disciplinas', async () => {
        axios.get.mockResolvedValueOnce({
            data: [
                { id: 1, nome: 'Matemática', carga_horaria: 80 },
                { id: 2, nome: 'História', carga_horaria: 60 }
            ]
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Disciplinas />
                </BrowserRouter>
            </Provider>
        );

        expect(await screen.findByText('Matemática')).toBeInTheDocument();
        expect(screen.getByText('80h')).toBeInTheDocument();
        expect(screen.getByText('História')).toBeInTheDocument();
        expect(screen.getByText('60h')).toBeInTheDocument();
        expect(axios.get).toHaveBeenCalledWith('/disciplinas');
    });

    it('deve permitir criar uma nova disciplina via POST /disciplinas', async () => {
        axios.get.mockResolvedValueOnce({ data: [] });
        axios.post.mockResolvedValueOnce({
            data: { id: 3, nome: 'Física', carga_horaria: 60 }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Disciplinas />
                </BrowserRouter>
            </Provider>
        );

        expect(await screen.findByText(/Nenhuma disciplina cadastrada/i)).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText('Nome'), {
            target: { value: 'Física' }
        });
        fireEvent.change(screen.getByPlaceholderText('Carga horária'), {
            target: { value: '60' }
        });

        fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/disciplinas', {
                nome: 'Física',
                carga_horaria: '60'
            });
        });

        expect(await screen.findByText('Física')).toBeInTheDocument();
        expect(screen.getByText('60h')).toBeInTheDocument();
    });

    it('deve permitir editar uma disciplina existente via PUT /disciplinas/:id', async () => {
        axios.get.mockResolvedValueOnce({
            data: [{ id: 1, nome: 'Matemática', carga_horaria: 80 }]
        });
        axios.put.mockResolvedValueOnce({
            data: { id: 1, nome: 'Matemática Aplicada', carga_horaria: 100 }
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Disciplinas />
                </BrowserRouter>
            </Provider>
        );

        expect(await screen.findByText('Matemática')).toBeInTheDocument();

        fireEvent.click(screen.getByTitle('Editar disciplina'));

        expect(screen.getByText(/Editando Disciplina #1/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Nome')).toHaveValue('Matemática');
        expect(screen.getByPlaceholderText('Carga horária')).toHaveValue(80);

        fireEvent.change(screen.getByPlaceholderText('Nome'), {
            target: { value: 'Matemática Aplicada' }
        });
        fireEvent.change(screen.getByPlaceholderText('Carga horária'), {
            target: { value: '100' }
        });

        fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith('/disciplinas/1', {
                nome: 'Matemática Aplicada',
                carga_horaria: '100'
            });
        });

        expect(await screen.findByText('Matemática Aplicada')).toBeInTheDocument();
        expect(screen.getByText('100h')).toBeInTheDocument();
    });

    it('deve permitir excluir uma disciplina existente via DELETE /disciplinas/:id', async () => {
        axios.get.mockResolvedValueOnce({
            data: [{ id: 1, nome: 'Matemática', carga_horaria: 80 }]
        });
        axios.delete.mockResolvedValueOnce({});

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Disciplinas />
                </BrowserRouter>
            </Provider>
        );

        expect(await screen.findByText('Matemática')).toBeInTheDocument();

        fireEvent.click(screen.getByTitle('Excluir disciplina'));

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith('/disciplinas/1');
        });

        await waitFor(() => {
            expect(screen.queryByText('Matemática')).not.toBeInTheDocument();
        });
    });
});
