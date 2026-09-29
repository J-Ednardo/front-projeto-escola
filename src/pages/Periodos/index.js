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

            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '30px' }}>
                <input type="number" placeholder="Ano (ex: 2026)" value={ano} onChange={e => setAno(e.target.value)} required />
                <input type="number" placeholder="Semestre (1 ou 2)" value={semestre} onChange={e => setSemestre(e.target.value)} required />
                <button type="submit">Criar Semestre</button>
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Período Letivo</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Status</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {periodos.map(p => (
                        <tr key={p.id}>
                            <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{p.ano}.{p.semestre}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center', fontWeight: 'bold', color: p.status === 'ABERTO' ? 'green' : 'red' }}>
                                {p.status}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                                <button 
                                    onClick={() => handleToggleStatus(p.id, p.status)}
                                    style={{ padding: '5px 10px', background: p.status === 'ABERTO' ? '#dc3545' : '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    {p.status === 'ABERTO' ? 'Encerrar' : 'Reabrir'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {periodos.length === 0 && (
                        <tr><td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>Nenhum semestre cadastrado.</td></tr>
                    )}
                </tbody>
            </table>
        </Container>
    );
}
