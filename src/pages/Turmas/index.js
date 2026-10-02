import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import axios from '../../services/axios';

export default function Turmas() {
    const [turmas, setTurmas] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [codigo, setCodigo] = useState('');
    const [disciplinaId, setDisciplinaId] = useState('');
    const [periodoId, setPeriodoId] = useState('');
    const [professorId, setProfessorId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                const [resTurmas, resDisc, resPer, resUsers] = await Promise.all([
                    axios.get('/turmas'),
                    axios.get('/disciplinas'),
                    axios.get('/periodos-letivos'),
                    axios.get('/users')
                ]);
                setTurmas(resTurmas.data);
                setDisciplinas(resDisc.data);
                setPeriodos(resPer.data);
                
                // Filtra apenas os usuários que são professores (ou admins que lecionam)
                const usersList = resUsers.data.data || [];
                const profs = usersList.filter(u => u.perfil === 'PROFESSOR' || u.perfil === 'ADMIN');
                setProfessores(profs);

                setIsLoading(false);
            } catch(e) {
                console.error(e);
                setIsLoading(false);
                toast.error('Erro ao carregar dados');
            }
        }
        getData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const { data } = await axios.post('/turmas', { 
                codigo, 
                disciplina_id: disciplinaId,
                periodo_id: periodoId,
                professor_id: professorId
            });
            setTurmas([...turmas, data]);
            toast.success('Turma cadastrada!');
            setIsLoading(false);
        } catch(e) {
            setIsLoading(false);
            if (e.customError) {
                toast.error(e.customError.mensagem);
            } else {
                toast.error('Erro ao cadastrar turma');
            }
        }
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />
            <h1>Turmas</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', marginTop: '20px', marginBottom: '20px' }}>
                <input type="text" placeholder="Código" aria-label="Código da Turma" value={codigo} onChange={e => setCodigo(e.target.value)} required style={{ flex: 1 }} />
                <select aria-label="Disciplina da Turma" value={disciplinaId} onChange={e => setDisciplinaId(e.target.value)} required style={{ flex: 1 }}>
                    <option value="">Disciplina</option>
                    {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
                <select aria-label="Período da Turma" value={periodoId} onChange={e => setPeriodoId(e.target.value)} required style={{ flex: 1 }}>
                    <option value="">Período</option>
                    {periodos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
                <select aria-label="Professor da Turma" value={professorId} onChange={e => setProfessorId(e.target.value)} required style={{ flex: 1 }}>
                    <option value="">Professor</option>
                    {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
                <button type="submit">Cadastrar</button>
            </form>

            <ul>
                {turmas.map(t => (
                    <li key={t.id} style={{ padding: '16px 0', borderBottom: '1px solid #E8E9ED', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 500, color: '#2D3436' }}>Turma: {t.codigo} (Disc: {t.disciplina_id} / Período: {t.periodo_id})</span>
                        <Link to={`/turmas/${t.id}/matriculas`} aria-label={`Ver diário da turma ${t.codigo}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#6C5CE7', color: '#fff', padding: '0 20px', height: '40px', borderRadius: '12px', fontSize: '14px', fontWeight: 600 }}>Ver Diário</Link>
                    </li>
                ))}
            </ul>
        </Container>
    );
}
