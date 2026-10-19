import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaBook, FaCalendarAlt, FaPlus, FaArrowRight } from 'react-icons/fa';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import axios from '../../services/axios';
import { PageHeader, FormCard, TurmasGrid, TurmaCard, DiarioLink } from './styled';

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
            setCodigo('');
            setDisciplinaId('');
            setPeriodoId('');
            setProfessorId('');
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

    const periodosAbertos = periodos.filter(p => p.status !== 'FECHADO');
    const turmasAtivas = turmas.filter(t => {
        const per = periodos.find(p => String(p.id) === String(t.periodo_id));
        const statusPeriodo = t.PeriodoLetivo?.status || per?.status;
        return statusPeriodo !== 'FECHADO';
    });

    return (
        <Container>
            <Loading isLoading={isLoading} />
            
            <PageHeader>
                <div>
                    <h1>Turmas</h1>
                    <p className="subtitle">Gestão de turmas ativas, alocação de docentes e diários de classe</p>
                </div>
            </PageHeader>

            <FormCard>
                <h3>Cadastrar Nova Turma</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Código da Turma" 
                        aria-label="Código da Turma" 
                        value={codigo} 
                        onChange={e => setCodigo(e.target.value)} 
                        required 
                    />
                    <select 
                        aria-label="Disciplina da Turma" 
                        value={disciplinaId} 
                        onChange={e => setDisciplinaId(e.target.value)} 
                        required
                    >
                        <option value="">Selecione a Disciplina</option>
                        {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                    </select>
                    <select 
                        aria-label="Período da Turma" 
                        value={periodoId} 
                        onChange={e => setPeriodoId(e.target.value)} 
                        required
                    >
                        <option value="">Selecione o Período</option>
                        {periodosAbertos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                    <select 
                        aria-label="Professor da Turma" 
                        value={professorId} 
                        onChange={e => setProfessorId(e.target.value)} 
                        required
                    >
                        <option value="">Selecione o Professor</option>
                        {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                    <button type="submit">
                        <FaPlus size={12} /> Cadastrar
                    </button>
                </form>
            </FormCard>

            {turmasAtivas.length === 0 && !isLoading ? (
                <EmptyState 
                    title="Nenhuma turma cadastrada" 
                    description="Utilize o formulário acima para criar a primeira turma deste semestre letivo."
                />
            ) : (
                <TurmasGrid>
                    {turmasAtivas.map(t => {
                        const disc = disciplinas.find(d => String(d.id) === String(t.disciplina_id));
                        const per = periodos.find(p => String(p.id) === String(t.periodo_id));
                        const prof = professores.find(u => String(u.id) === String(t.professor_id));

                        return (
                            <TurmaCard key={t.id}>
                                <div>
                                    <div className="turma-header">
                                        <span className="turma-badge">Turma {t.codigo}</span>
                                        <span className="periodo-pill">{t.PeriodoLetivo?.nome || per?.nome || `Período #${t.periodo_id}`}</span>
                                    </div>
                                    <div className="disciplina-nome">
                                        {t.Disciplina?.nome || disc?.nome || `Disciplina #${t.disciplina_id}`}
                                    </div>
                                    <div className="meta-info">
                                        <span>
                                            <FaChalkboardTeacher size={13} color="#94A3B8" />
                                            {prof?.nome ? `Prof. ${prof.nome}` : 'Docente a definir'}
                                        </span>
                                    </div>
                                </div>

                                <DiarioLink to={`/turmas/${t.id}/matriculas`} aria-label={`Ver diário da turma ${t.codigo}`}>
                                    Ver Diário de Classe <FaArrowRight size={11} />
                                </DiarioLink>
                            </TurmaCard>
                        );
                    })}
                </TurmasGrid>
            )}
        </Container>
    );
}
