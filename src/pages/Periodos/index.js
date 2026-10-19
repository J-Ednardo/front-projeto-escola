import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import axios from '../../services/axios';
import { PageHeader, FormCard, StatusPill, ActionButton } from './styled';

export default function Periodos() {
    const [periodos, setPeriodos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Forms
    const [ano, setAno] = useState('');
    const [semestre, setSemestre] = useState('');

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                const response = await axios.get('/periodos-letivos');
                setPeriodos(response.data);
                setIsLoading(false);
            } catch(e) {
                setIsLoading(false);
                toast.error('Erro ao carregar semestres');
            }
        }
        getData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const nome = `${ano}.${semestre}`;
            const { data } = await axios.post('/periodos-letivos', { nome });
            setPeriodos([...periodos, data]);
            toast.success('Período criado com sucesso!');
            setAno('');
            setSemestre('');
            setIsLoading(false);
        } catch(e) {
            setIsLoading(false);
            if (e.customError) {
                toast.error(e.customError.mensagem);
            } else {
                toast.error('Erro ao criar período letivo');
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ABERTO' ? 'FECHADO' : 'ABERTO';
        const msg = newStatus === 'FECHADO' 
            ? 'Tem certeza que deseja ENCERRAR este semestre? Edições de notas e chamadas serão bloqueadas.'
            : 'Tem certeza que deseja REABRIR este semestre?';
            
        if (!window.confirm(msg)) return;

        try {
            setIsLoading(true);
            const { data } = await axios.put('/periodos-letivos/' + id, { status: newStatus });
            setPeriodos(periodos.map(p => p.id === id ? data : p));
            toast.success('Status atualizado!');
            setIsLoading(false);
        } catch(e) {
            setIsLoading(false);
            if (e.customError) {
                toast.error(e.customError.mensagem);
            } else {
                toast.error('Erro ao mudar status do período');
            }
        }
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />
            
            <PageHeader>
                <div>
                    <h1>Gestão de Semestres</h1>
                    <p className="subtitle">Configuração de períodos letivos e controle de trancamento de notas</p>
                </div>
            </PageHeader>

            <FormCard>
                <h3>Criar Novo Semestre</h3>
                <form onSubmit={handleCreate}>
                    <input 
                        type="number" 
                        placeholder="Ano (ex: 2026)" 
                        value={ano} 
                        onChange={e => setAno(e.target.value)} 
                        required 
                    />
                    <input 
                        type="number" 
                        placeholder="Semestre (1 ou 2)" 
                        value={semestre} 
                        onChange={e => setSemestre(e.target.value)} 
                        required 
                        min="1" 
                        max="2" 
                    />
                    <button type="submit">
                        <FaPlus size={12} /> Criar Semestre
                    </button>
                </form>
            </FormCard>

            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Período Letivo</th>
                            <th style={{ width: '160px', textAlign: 'center' }}>Status</th>
                            <th style={{ width: '140px', textAlign: 'center' }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {periodos.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: 700, fontSize: '15px' }}>{p.nome}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <StatusPill className={p.status === 'ABERTO' ? 'aberto' : 'fechado'}>
                                        {p.status}
                                    </StatusPill>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <ActionButton 
                                        onClick={() => handleToggleStatus(p.id, p.status)}
                                        className={p.status === 'ABERTO' ? 'encerrar' : 'reabrir'}
                                    >
                                        {p.status === 'ABERTO' ? 'Encerrar' : 'Reabrir'}
                                    </ActionButton>
                                </td>
                            </tr>
                        ))}
                        {periodos.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '32px' }}>
                                    Nenhum semestre cadastrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Container>
    );
}
