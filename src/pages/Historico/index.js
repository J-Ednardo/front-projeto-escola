import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import axios from '../../services/axios';

export default function Historico() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                const res = await axios.get('/alunos/' + id + '/historico');
                setData(res.data);
                setIsLoading(false);
            } catch(e) {
                setIsLoading(false);
                toast.error('Erro ao carregar histórico escolar');
            }
        }
        getData();
    }, [id]);

    if (!data) return <Container><Loading isLoading={isLoading} /></Container>;

    const { aluno, estatisticas, periodos } = data;

    return (
        <Container>
            <Loading isLoading={isLoading} />
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '20px' }}>Histórico Escolar Oficial</h1>
                <h2 style={{ color: '#636E72', marginTop: '10px', fontWeight: 500, fontSize: '16px' }}>{aluno.nome} {aluno.sobrenome}</h2>
            </div>

            <dl style={{ display: 'flex', justifyContent: 'space-around', background: '#F5F6FA', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid #E8E9ED' }}>
                <div style={{ textAlign: 'center' }}>
                    <dt style={{ fontSize: '12px', color: '#636E72', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CH Integralizada</dt>
                    <dd style={{ fontSize: '32px', fontWeight: 'bold', color: '#6C5CE7', margin: 0 }}>{estatisticas.carga_horaria_integralizada}h</dd>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <dt style={{ fontSize: '12px', color: '#636E72', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Coef. Rendimento (CR)</dt>
                    <dd style={{ fontSize: '32px', fontWeight: 'bold', color: '#00B894', margin: 0 }}>{estatisticas.coeficiente_rendimento}</dd>
                </div>
            </dl>

            {Object.keys(periodos).sort().reverse().map(periodo => (
                <div key={periodo} style={{ marginBottom: '30px' }}>
                    <h3 style={{ borderBottom: '2px solid #6C5CE7', paddingBottom: '8px', color: '#2D3436', fontSize: '16px' }}>
                        Período Letivo: {periodo}
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ background: '#F5F6FA' }}>
                                <th scope="col" style={{ padding: '14px 16px', border: '1px solid #E8E9ED', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', color: '#636E72' }}>Disciplina</th>
                                <th scope="col" style={{ padding: '14px 16px', border: '1px solid #E8E9ED', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', color: '#636E72' }}>CH</th>
                                <th scope="col" style={{ padding: '14px 16px', border: '1px solid #E8E9ED', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', color: '#636E72' }}>Média Final</th>
                                <th scope="col" style={{ padding: '14px 16px', border: '1px solid #E8E9ED', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', color: '#636E72' }}>Faltas</th>
                                <th scope="col" style={{ padding: '14px 16px', border: '1px solid #E8E9ED', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', color: '#636E72' }}>Situação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {periodos[periodo].map((m, idx) => (
                                <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                                    <td style={{ padding: '14px 16px', border: '1px solid #E8E9ED', fontSize: '14px' }}>{m.disciplina}</td>
                                    <td style={{ padding: '14px 16px', border: '1px solid #E8E9ED', textAlign: 'center', fontSize: '14px' }}>{m.carga_horaria}h</td>
                                    <td style={{ padding: '14px 16px', border: '1px solid #E8E9ED', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{m.media_final ?? '-'}</td>
                                    <td style={{ padding: '14px 16px', border: '1px solid #E8E9ED', textAlign: 'center', fontSize: '14px' }}>{m.faltas}</td>
                                    <td style={{ padding: '14px 16px', border: '1px solid #E8E9ED', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', color: m.situacao === 'Aprovado' ? '#00B894' : (m.situacao === 'Em Recuperação' ? '#856404' : '#D63031') }}>
                                        {m.situacao || 'Cursando'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            
            {Object.keys(periodos).length === 0 && (
                <p style={{ textAlign: 'center', color: '#636E72' }}>O aluno ainda não possui registros no histórico.</p>
            )}
        </Container>
    );
}
