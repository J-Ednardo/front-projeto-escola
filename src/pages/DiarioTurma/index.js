import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { FaUserPlus, FaCalendarCheck, FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import axios from '../../services/axios';
import { 
    PageHeader, 
    ChamadaButton, 
    NoticeAlert, 
    FormRow, 
    SummaryGrid,
    TableWrapper, 
    GradeInput, 
    StatusPill 
} from './styled';

export default function DiarioTurma() {
    const { id } = useParams(); // turma_id
    const perfil = useSelector(state => state.auth?.user?.perfil) || 'ADMIN';
    const isAdmin = perfil === 'ADMIN';

    const [matriculas, setMatriculas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [turma, setTurma] = useState(null);
    const [alunoId, setAlunoId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                const resMat = await axios.get('/matriculas');
                const turmMat = resMat.data.filter(m => String(m.turma_id) === String(id));
                setMatriculas(turmMat);

                const resAlunos = await axios.get('/alunos');
                setAlunos(get(resAlunos.data, 'data', []));

                const resTurma = await axios.get(`/turmas/${id}`);
                setTurma(resTurma.data);

                setIsLoading(false);
            } catch(e) {
                setIsLoading(false);
                toast.error('Erro ao carregar diário');
            }
        }
        getData();
    }, [id]);

    const isFechado = turma?.PeriodoLetivo?.status === 'FECHADO';

    const handleMatricular = async (e) => {
        e.preventDefault();
        if (isFechado || !isAdmin) return;
        try {
            setIsLoading(true);
            const { data } = await axios.post('/matriculas', { 
                turma_id: id,
                aluno_id: alunoId 
            });
            setMatriculas([...matriculas, data]);
            setAlunoId('');
            toast.success('Aluno matriculado com sucesso!');
            setIsLoading(false);
        } catch(e) {
            setIsLoading(false);
            const msg = e?.customError?.mensagem || e?.response?.data?.erro?.mensagem || 'Erro ao matricular aluno';
            toast.error(msg);
        }
    };

    const handleRemoverMatricula = async (matriculaId) => {
        if (isFechado || !isAdmin) return;
        if (!window.confirm('Deseja realmente remover a matrícula deste aluno nesta turma?')) return;
        try {
            setIsLoading(true);
            await axios.delete(`/matriculas/${matriculaId}`);
            setMatriculas(matriculas.filter(m => m.id !== matriculaId));
            toast.success('Matrícula removida!');
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            const msg = e?.customError?.mensagem || e?.response?.data?.erro?.mensagem || 'Erro ao remover matrícula';
            toast.error(msg);
        }
    };

    const handleSalvarNota = async (matriculaId, field, value) => {
        if (isFechado) return;
        if (value !== '' && value !== null && value !== undefined) {
            const num = Number(value);
            if (Number.isNaN(num) || num < 0 || num > 10) {
                toast.error('A nota deve ser um valor entre 0 e 10.');
                return;
            }
        }
        try {
            const payload = {};
            payload[field] = value === '' ? null : value;
            const { data } = await axios.put(`/matriculas/${matriculaId}`, payload);
            
            setMatriculas(matriculas.map(m => m.id === matriculaId ? { ...m, ...data } : m));
            toast.success('Nota salva com sucesso');
        } catch(e) {
            const msg = e?.customError?.mensagem || e?.response?.data?.erro?.mensagem || 'Erro ao salvar nota';
            toast.error(msg);
        }
    };

    const getStatusClass = (situacao) => {
        if (!situacao) return 'cursando';
        if (situacao === 'Aprovado') return 'aprovado';
        if (situacao === 'Em Recuperação') return 'recuperacao';
        if (situacao.includes('Reprovado')) return 'reprovado';
        return 'cursando';
    };

    const alunosDisponiveis = alunos.filter(
        a => !matriculas.some(m => String(m.aluno_id) === String(a.id))
    );

    const totalAprovados = matriculas.filter(m => m.situacao === 'Aprovado').length;
    const totalRecuperacao = matriculas.filter(m => m.situacao === 'Em Recuperação').length;
    const totalReprovados = matriculas.filter(m => m.situacao && m.situacao.includes('Reprovado')).length;

    return (
        <Container>
            <Loading isLoading={isLoading} />
            
            <PageHeader>
                <div>
                    <h1>Diário da Turma {turma?.codigo ? `(${turma.codigo})` : `#${id}`}</h1>
                    <p className="subtitle">
                        {turma?.Disciplina?.nome || 'Disciplina'} • {turma?.PeriodoLetivo?.nome || 'Semestre'}
                        {turma?.Professor?.nome ? ` • Prof. ${turma.Professor.nome}` : ''}
                    </p>
                </div>
                {!isFechado && (
                    <ChamadaButton to={`/turmas/${id}/chamada`}>
                        <FaCalendarCheck size={14} /> Fazer Chamada
                    </ChamadaButton>
                )}
            </PageHeader>

            {isFechado && (
                <NoticeAlert>
                    <FaExclamationTriangle size={18} />
                    <span>Este semestre está encerrado e arquivado. Lançamento de notas e alterações bloqueados.</span>
                </NoticeAlert>
            )}

            <SummaryGrid>
                <div className="kpi-card">
                    <span className="kpi-label">Matriculados</span>
                    <span className="kpi-value">{matriculas.length}</span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-label">Aprovados</span>
                    <span className="kpi-value" style={{ color: '#16A34A' }}>{totalAprovados}</span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-label">Em Recuperação</span>
                    <span className="kpi-value" style={{ color: '#D97706' }}>{totalRecuperacao}</span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-label">Reprovados</span>
                    <span className="kpi-value" style={{ color: '#DC2626' }}>{totalReprovados}</span>
                </div>
            </SummaryGrid>

            {isAdmin && (
                <FormRow onSubmit={handleMatricular}>
                    <select value={alunoId} onChange={e => setAlunoId(e.target.value)} required disabled={isFechado}>
                        <option value="">Selecione o Aluno para Matricular nesta Turma</option>
                        {alunosDisponiveis.map(a => <option key={a.id} value={a.id}>{a.nome} {a.sobrenome}</option>)}
                    </select>
                    <button type="submit" disabled={isFechado}>
                        <FaUserPlus size={13} /> Matricular Aluno
                    </button>
                </FormRow>
            )}

            {matriculas.length === 0 && !isLoading ? (
                <EmptyState 
                    title="Nenhum aluno matriculado nesta turma" 
                    description={
                        isAdmin
                            ? 'Selecione um aluno na lista acima para efetuar a primeira matrícula.'
                            : 'Aguarde a secretaria realizar a matrícula dos alunos nesta turma.'
                    }
                />
            ) : (
                <TableWrapper>
                    <table>
                        <thead>
                            <tr>
                                <th>Aluno</th>
                                <th style={{ textAlign: 'center' }}>Faltas</th>
                                <th style={{ textAlign: 'center' }}>N1</th>
                                <th style={{ textAlign: 'center' }}>N2</th>
                                <th style={{ textAlign: 'center' }}>N3</th>
                                <th style={{ textAlign: 'center' }}>Recuperação</th>
                                <th style={{ textAlign: 'center' }}>Média</th>
                                <th style={{ textAlign: 'center' }}>Situação</th>
                                {isAdmin && !isFechado && <th style={{ textAlign: 'center', width: '70px' }}>Ação</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {matriculas.map(m => {
                                const faltasArray = m.Frequencia || m.Frequencias || [];
                                const novasFaltas = faltasArray.filter(f => f.presente === false || f.presente === 0 || f.presente === '0').length;
                                const faltasCalc = (m.faltas_legado || 0) + novasFaltas;
                                const reprovado = m.situacao === 'Reprovado por falta' || m.situacao === 'Reprovado por nota';
                                const recuperacao = m.situacao === 'Em Recuperação';

                                const alunoObj = alunos.find(a => String(a.id) === String(m.aluno_id));
                                const nomeAluno = m.Aluno ? `${m.Aluno.nome} ${m.Aluno.sobrenome}` : (alunoObj ? `${alunoObj.nome} ${alunoObj.sobrenome}` : `Aluno #${m.aluno_id}`);

                                return (
                                <tr key={m.id}>
                                    <td style={{ fontWeight: 600 }}>{nomeAluno}</td>
                                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: reprovado ? '#DC2626' : 'inherit' }}>
                                        {faltasCalc}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <GradeInput 
                                            type="number" 
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            defaultValue={m.nota1} 
                                            disabled={isFechado} 
                                            onBlur={e => handleSalvarNota(m.id, 'nota1', e.target.value)} 
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <GradeInput 
                                            type="number" 
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            defaultValue={m.nota2} 
                                            disabled={isFechado} 
                                            onBlur={e => handleSalvarNota(m.id, 'nota2', e.target.value)} 
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <GradeInput 
                                            type="number" 
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            defaultValue={m.nota3} 
                                            disabled={isFechado} 
                                            onBlur={e => handleSalvarNota(m.id, 'nota3', e.target.value)} 
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <GradeInput 
                                            type="number" 
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            defaultValue={m.nota_recuperacao} 
                                            onBlur={e => handleSalvarNota(m.id, 'nota_recuperacao', e.target.value)} 
                                            disabled={isFechado || (!recuperacao && m.nota_recuperacao === null)} 
                                            title={isFechado ? "Semestre encerrado" : (!recuperacao && m.nota_recuperacao === null ? "Aluno não está em recuperação" : "")}
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '15px' }}>
                                        {m.media_final ?? '-'}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <StatusPill className={getStatusClass(m.situacao)}>
                                            {m.situacao || 'Cursando'}
                                        </StatusPill>
                                    </td>
                                    {isAdmin && !isFechado && (
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoverMatricula(m.id)}
                                                title="Remover matrícula do aluno"
                                                style={{ padding: '6px 10px', background: '#FEF2F2', color: '#DC2626' }}
                                            >
                                                <FaTrashAlt size={12} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </TableWrapper>
            )}
        </Container>
    );
}

