import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom';
import { FaExclamationTriangle, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import axios from '../../services/axios';
import { 
    PageHeader, 
    NoticeAlert, 
    LessonCard, 
    AttendanceTableWrapper, 
    ToggleButton, 
    SaveButton, 
    AulasAnterioresSection 
} from './styled';

export default function Chamada() {
    const { id } = useParams(); // turma_id
    const history = useHistory();
    const [matriculas, setMatriculas] = useState([]);
    const [dataAula, setDataAula] = useState(new Date().toISOString().split('T')[0]);
    const [conteudo, setConteudo] = useState('');
    const [presencas, setPresencas] = useState({}); // { matricula_id: true/false }
    const [turma, setTurma] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [aulas, setAulas] = useState([]);

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                const [resMat, resTurma, resAulas] = await Promise.all([
                    axios.get('/matriculas'),
                    axios.get(`/turmas/${id}`),
                    axios.get(`/turmas/${id}/aulas`)
                ]);
                const turmMat = resMat.data.filter(m => String(m.turma_id) === String(id));
                setMatriculas(turmMat);
                
                const pres = {};
                turmMat.forEach(m => pres[m.id] = true);
                setPresencas(pres);
                setTurma(resTurma.data);
                setAulas(resAulas.data || []);

                setIsLoading(false);
            } catch(e) {
                setIsLoading(false);
                if (e.customError) {
                    toast.error(e.customError.mensagem);
                } else {
                    toast.error('Erro ao carregar dados para chamada');
                }
            }
        }
        getData();
    }, [id]);

    const isFechado = turma?.PeriodoLetivo?.status === 'FECHADO';
    const jaExisteAulaNaData = aulas.some(a => {
        if (!a.data) return false;
        const aData = String(a.data).split('T')[0];
        return aData === dataAula;
    });

    const handleToggle = (matriculaId) => {
        if (isFechado) return;
        setPresencas({
            ...presencas,
            [matriculaId]: !presencas[matriculaId]
        });
    };

    const handleSalvarChamada = async (e) => {
        e.preventDefault();
        if (isFechado) return;
        if (jaExisteAulaNaData) {
            toast.error('Já existe uma aula/chamada registrada para esta turma nesta data.');
            return;
        }
        try {
            setIsLoading(true);
            
            // 1. Cria a Aula
            const resAula = await axios.post(`/turmas/${id}/aulas`, {
                data: dataAula,
                conteudo
            });
            const aulaId = resAula.data.id;

            // 2. Prepara lote de frequencias
            const lote = matriculas.map(m => ({
                matricula_id: m.id,
                presente: presencas[m.id]
            }));

            // 3. Salva Frequencias
            await axios.post(`/aulas/${aulaId}/frequencias`, lote);

            toast.success('Chamada salva com sucesso!');
            setIsLoading(false);
            history.push(`/turmas/${id}/matriculas`);

        } catch (e) {
            setIsLoading(false);
            const msg = e?.response?.data?.erro?.mensagem || 'Erro ao salvar chamada';
            toast.error(msg);
        }
    };

    const [aulaExpandedId, setAulaExpandedId] = useState(null);

    const handleToggleFrequenciaAnterior = async (aulaId, freq) => {
        if (isFechado) return;
        try {
            const novoStatus = !freq.presente;
            await axios.put(`/frequencias/${freq.id}`, { presente: novoStatus });
            setAulas(aulas.map(a => {
                if (a.id !== aulaId) return a;
                const lista = a.Frequencias || a.Frequencia || [];
                const novaLista = lista.map(f => f.id === freq.id ? { ...f, presente: novoStatus } : f);
                return { ...a, Frequencias: novaLista, Frequencia: novaLista };
            }));
            toast.success('Frequência atualizada!');
        } catch (e) {
            const msg = e?.customError?.mensagem || e?.response?.data?.erro?.mensagem || 'Erro ao atualizar frequência';
            toast.error(msg);
        }
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />
            
            <PageHeader>
                <div>
                    <h1>Fazer Chamada - Turma {turma?.codigo ? `${turma.codigo} (#${id})` : id}</h1>
                    <p className="subtitle">Registro diário de frequência e lançamento de conteúdo programático</p>
                </div>
            </PageHeader>

            {isFechado && (
                <NoticeAlert>
                    <FaExclamationTriangle size={18} />
                    <span>Este semestre está encerrado e arquivado. Edições bloqueadas.</span>
                </NoticeAlert>
            )}

            {!isFechado && jaExisteAulaNaData && (
                <NoticeAlert $variant="danger">
                    <FaExclamationTriangle size={18} />
                    <span>Já existe uma aula/chamada registrada para a data {dataAula}. Selecione outra data para registrar uma nova chamada.</span>
                </NoticeAlert>
            )}

            <form onSubmit={handleSalvarChamada}>
                <LessonCard>
                    <div className="fields-row">
                        <div style={{ flex: 1 }}>
                            <label>
                                Data da Aula
                                <input 
                                    type="date" 
                                    value={dataAula} 
                                    onChange={e => setDataAula(e.target.value)} 
                                    disabled={isFechado} 
                                    required 
                                />
                                {jaExisteAulaNaData && (
                                    <span style={{ color: '#DC2626', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>
                                        Chamada já registrada nesta data
                                    </span>
                                )}
                            </label>
                        </div>
                        <div style={{ flex: 2 }}>
                            <label>
                                Conteúdo Ministrado
                                <input 
                                    type="text" 
                                    placeholder="Ex: Tópico abordado, capítulo ou exercícios realizados"
                                    value={conteudo} 
                                    onChange={e => setConteudo(e.target.value)} 
                                    disabled={isFechado} 
                                    required 
                                />
                            </label>
                        </div>
                    </div>
                </LessonCard>

                {matriculas.length === 0 ? (
                    <EmptyState 
                        title="Nenhum aluno matriculado nesta turma" 
                        description="Você precisa matricular alunos nesta turma no Diário antes de registrar chamadas."
                    />
                ) : (
                    <>
                        <AttendanceTableWrapper>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Aluno (Matrícula ID)</th>
                                        <th style={{ textAlign: 'center', width: '160px' }}>Presença</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matriculas.map(m => {
                                        const isPresente = presencas[m.id];
                                        return (
                                            <tr key={m.id}>
                                                <td className="aluno-cell">
                                                    {m.Aluno?.nome} {m.Aluno?.sobrenome} 
                                                    <span className="matricula-id">(Matrícula #{m.id})</span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <ToggleButton 
                                                        type="button"
                                                        disabled={isFechado}
                                                        onClick={() => handleToggle(m.id)}
                                                        className={isPresente ? 'presente' : 'falta'}
                                                    >
                                                        {isPresente ? <><FaCheck size={11} /> Presente</> : <><FaTimes size={11} /> Falta</>}
                                                    </ToggleButton>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </AttendanceTableWrapper>

                        <SaveButton type="submit" disabled={isFechado || jaExisteAulaNaData}>
                            {jaExisteAulaNaData ? 'Chamada Já Registrada Nesta Data' : 'Salvar Lote de Chamada'}
                        </SaveButton>
                    </>
                )}
            </form>

            {aulas.length > 0 && (
                <AulasAnterioresSection>
                    <h2>Aulas Ministradas</h2>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '160px' }}>Data</th>
                                <th>Conteúdo</th>
                                <th style={{ width: '180px', textAlign: 'right' }}>Frequências</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aulas.map(a => {
                                const freqs = a.Frequencias || a.Frequencia || [];
                                const isExpanded = aulaExpandedId === a.id;
                                return (
                                    <React.Fragment key={a.id}>
                                        <tr>
                                            <td style={{ fontWeight: 600 }}>{a.data}</td>
                                            <td>{a.conteudo}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                {freqs.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setAulaExpandedId(isExpanded ? null : a.id)}
                                                        style={{ padding: '6px 12px', fontSize: '12px', background: '#EFF6FF', color: '#2563EB' }}
                                                    >
                                                        {isExpanded ? 'Ocultar Chamada' : `Ver Chamada (${freqs.length})`}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                        {isExpanded && freqs.map(f => {
                                            const mat = matriculas.find(m => String(m.id) === String(f.matricula_id));
                                            const nomeAluno = mat?.Aluno ? `${mat.Aluno.nome} ${mat.Aluno.sobrenome}` : `Matrícula #${f.matricula_id}`;
                                            return (
                                                <tr key={`freq-${f.id}`} style={{ background: '#F8FAFC' }}>
                                                    <td colSpan="2" style={{ paddingLeft: '28px', fontSize: '13px' }}>
                                                        ↳ {nomeAluno}
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <ToggleButton
                                                            type="button"
                                                            disabled={isFechado}
                                                            onClick={() => handleToggleFrequenciaAnterior(a.id, f)}
                                                            className={f.presente ? 'presente' : 'falta'}
                                                        >
                                                            {f.presente ? <><FaCheck size={11} /> Presente</> : <><FaTimes size={11} /> Falta</>}
                                                        </ToggleButton>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </AulasAnterioresSection>
            )}
        </Container>
    );
}
