import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import axios from '../../services/axios';

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
            const { data } = await axios.post('/periodos-letivos', { ano, semestre });
            setPeriodos([...periodos, data]);
            toast.success('Período criado com sucesso!');
            setIsLoading(false);
        } catch(e) {
            setIsLoading(false);
            toast.error('Erro ao criar período letivo');
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
            toast.error('Erro ao mudar status do período');
        }
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />
            <h1>Gestão de Semestres</h1>

            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '15px', marginTop: '20px', marginBottom: '30px' }}>
                <input type="number" placeholder="Ano (ex: 2026)" value={ano} onChange={e => setAno(e.target.value)} required style={{ flex: 1 }} />
                <input type="number" placeholder="Semestre (1 ou 2)" value={semestre} onChange={e => setSemestre(e.target.value)} required style={{ flex: 1 }} />
                <button type="submit">Criar Semestre</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Período Letivo</th>
                        <th>Status</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {periodos.map(p => (
                        <tr key={p.id}>
                            <td>{p.ano}.{p.semestre}</td>
                            <td style={{ fontWeight: 'bold', color: p.status === 'ABERTO' ? '#00B894' : '#D63031' }}>
                                {p.status}
                            </td>
                            <td>
                                <button 
                                    onClick={() => handleToggleStatus(p.id, p.status)}
                                    style={{ background: p.status === 'ABERTO' ? '#d63031' : '#00b894', height: '40px', padding: '0 16px', fontSize: '13px', margin: 'auto' }}
                                >
                                    {p.status === 'ABERTO' ? 'Encerrar' : 'Reabrir'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {periodos.length === 0 && (
                        <tr><td colSpan="3" style={{ textAlign: 'center' }}>Nenhum semestre cadastrado.</td></tr>
                    )}
                </tbody>
            </table>
        </Container>
    );
}
