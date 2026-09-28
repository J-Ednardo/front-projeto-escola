import { call, put, all, takeLatest } from 'redux-saga/effects'; 
import { toast } from 'react-toastify';
import { get } from 'lodash';

import * as actions from './actions';
import * as types from '../types';
import axios from "../../../services/axios";
import history from '../../../services/history';


function* loginRequest({ payload }) {
    try {
        const response = yield call(axios.post, '/tokens', payload);
        yield put(actions.loginSuccess({ ...response.data }));

        toast.success('Você fez login');

        axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;
        
        const { perfil, aluno_id } = response.data.user;
        if (perfil === 'ALUNO') {
            if (aluno_id) {
                history.push(`/aluno/${aluno_id}/edit`);
            } else {
                toast.error('Seu usuário não possui um aluno vinculado.');
                history.push('/'); // Ou desloga, mas vamos mandar pro root que vai deslogar por rota restrita ou mostrar tela branca
            }
        } else {
            history.push(payload.prevPath || '/');
        }
    } catch (e) {
        if (e.customError) {
            toast.error(e.customError.mensagem);
        } else {
            toast.error('Ocorreu um erro ao fazer login');
        }

        yield put(actions.loginFailure());
    }
};

function persistRehydrate({ payload }) {
    const token = get(payload, 'auth.token', '');
    if (!token) return;
    axios.defaults.headers.Authorization = `Bearer ${token}`;
}

function* registerRequest({ payload }) {
    const { id, nome, email, password } = payload;
    
    try{
        if(id) {
            yield call(axios.put, '/users', {
                email,
                nome,
                password: password || undefined,
            });
            toast.success('Conta editada com sucesso!');
            yield put(actions.registerUpdatedSuccess({ nome, email, password }));
        } else {
            yield call(axios.post, '/users', {
                email,
                nome,
                password,
            });
            toast.success('Conta criada com sucesso!');
            yield put(actions.registerCreatedSuccess({ nome, email, password }));
            history.push('/login');
        }
    } catch (e) {
        if (e.customError) {
            const { mensagem, detalhes } = e.customError;
            if (detalhes && detalhes.length > 0) {
                detalhes.forEach(detalhe => toast.error(`${detalhe.campo}: ${detalhe.mensagem}`));
            } else {
                toast.error(mensagem);
            }
        } else {
            toast.error('Erro desconhecido');
        }

        const status = get(e, 'response.status', '');
        if(status === 401) {
            toast.error('Você precisa fazer login novamente');
            yield put(actions.loginFailure());
            return history.push('/login');
        }

        yield put(actions.registerFailure());
    }
}

export default all([
    takeLatest(types.LOGIN_REQUEST, loginRequest),
    takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
    takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
