import { call, put, all, takeLatest } from 'redux-saga/effects'; 
import { toast } from 'react-toastify';
import * as actions from './actions';
import * as types from '../types';

const requisicao = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, 600);
});

function* exampleRequest() {
    try {
        yield call(requisicao);
        yield put(actions.clicaBotaoSuccess());
        toast.success('Sucesso')
    } catch {
        yield put(actions.clicaBotaoFailure());
        toast.error('Error')
    }
};

export default all([
    takeLatest(types.BOTAO_CLICADO_REQUEST, exampleRequest),
]);
