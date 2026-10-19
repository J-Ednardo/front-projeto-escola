import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import axios from '../../services/axios';
import { useSelector } from 'react-redux';
import { 
    HeaderBox, 
    KpiGrid, 
    KpiCard, 
    PeriodoBlock, 
    StatusPill 
} from './styled';

export default function Historico() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const userAlunoId = useSelector(state => state.auth.user?.aluno_id);
    const fetchId = (id && id !== 'null' && id !== 'undefined') ? id : userAlunoId;

    useEffect(() => {
        if (!fetchId) return;

        async function getData() {
            try {
                setIsLoading(true);
                const res = await axios.get('/alunos/' + fetchId + '/historico');
                setData(res.data);
                setIsLoading(false);
            } catch(e) {
                setIsLoading(false);
                toast.error('Erro ao carregar histórico escolar');
            }
        }
        getData();
    }, [fetchId]);

    if (!fetchId) {
        return (
            <Container>
                <h2>Acesso Restrito</h2>
                <p style={{ marginTop: '12px', color: '#64748B' }}>
                    Sua conta de usuário ainda não está vinculada a nenhum registro de aluno. Por favor, contate a secretaria.
                </p>
            </Container>
        );
    }

    if (!data) return <Container><Loading isLoading={isLoading} /></Container>;

    const { aluno, estatisticas, periodos } = data;

    const getStatusClass = (situacao) => {
        if (!situacao) return 'cursando';
        if (situacao === 'Aprovado') return 'aprovado';
        if (situacao === 'Em Recuperação') return 'recuperacao';
        if (situacao.includes('Reprovado')) return 'reprovado';
        return 'cursando';
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />
            
            <HeaderBox>
                <span className="document-tag">Documento Oficial</span>
                <h1>Histórico Escolar Oficial</h1>
                <div className="student-name">{aluno.nome} {aluno.sobrenome}</div>
            </HeaderBox>

            <KpiGrid>
                <KpiCard>
                    <div className="kpi-label">CH Integralizada</div>
                    <div className="kpi-value primary">{estatisticas.carga_horaria_integralizada}h</div>
                </KpiCard>
                <KpiCard>
                    <div className="kpi-label">Coeficiente de Rendimento (CR)</div>
                    <div className="kpi-value success">{estatisticas.coeficiente_rendimento}</div>
                </KpiCard>
            </KpiGrid>

            {Object.keys(periodos).sort().reverse().map(periodo => (
                <PeriodoBlock key={periodo}>
                    <div className="periodo-header">
                        <h3>Período Letivo: {periodo}</h3>
                        <span className="periodo-tag">{periodos[periodo].length} {periodos[periodo].length === 1 ? 'disciplina' : 'disciplinas'}</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Disciplina</th>
                                    <th style={{ textAlign: 'center', width: '100px' }}>CH</th>
                                    <th style={{ textAlign: 'center', width: '120px' }}>Média Final</th>
                                    <th style={{ textAlign: 'center', width: '100px' }}>Faltas</th>
                                    <th style={{ textAlign: 'center', width: '140px' }}>Situação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {periodos[periodo].map((m, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontWeight: 600 }}>{m.disciplina}</td>
                                        <td style={{ textAlign: 'center' }}>{m.carga_horaria}h</td>
                                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{m.media_final ?? '-'}</td>
                                        <td style={{ textAlign: 'center' }}>{m.faltas}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <StatusPill className={getStatusClass(m.situacao)}>
                                                {m.situacao || 'Cursando'}
                                            </StatusPill>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </PeriodoBlock>
            ))}
            
            {Object.keys(periodos).length === 0 && (
                <EmptyState 
                    title="Nenhum registro encontrado" 
                    description="O aluno ainda não possui registros consolidados em seu histórico acadêmico."
                />
            )}
        </Container>
    );
}
