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

    const handleToggle = (matriculaId) => {
        setPresencas({
            ...presencas,
            [matriculaId]: !presencas[matriculaId]
        });
    };

    const handleSalvarChamada = async (e) => {
        e.preventDefault();
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

                        <SaveButton type="submit" disabled={isFechado}>
                            Salvar Lote de Chamada
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
                            </tr>
                        </thead>
                        <tbody>
                            {aulas.map(a => (
                                <tr key={a.id}>
                                    <td style={{ fontWeight: 600 }}>{a.data}</td>
                                    <td>{a.conteudo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </AulasAnterioresSection>
            )}
        </Container>
    );
}
