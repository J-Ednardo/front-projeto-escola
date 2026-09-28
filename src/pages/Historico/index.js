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
                <h1 style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>Histórico Escolar Oficial</h1>
                <h2 style={{ color: '#555', marginTop: '10px' }}>{aluno.nome} {aluno.sobrenome}</h2>
            </div>

            <dl style={{ display: 'flex', justifyContent: 'space-around', background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd' }}>
                <div style={{ textAlign: 'center' }}>
                    <dt style={{ fontSize: '14px', color: '#666', textTransform: 'uppercase' }}>CH Integralizada</dt>
                    <dd style={{ fontSize: '28px', fontWeight: 'bold', color: '#0056b3', margin: 0 }}>{estatisticas.carga_horaria_integralizada}h</dd>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <dt style={{ fontSize: '14px', color: '#666', textTransform: 'uppercase' }}>Coef. Rendimento (CR)</dt>
                    <dd style={{ fontSize: '28px', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>{estatisticas.coeficiente_rendimento}</dd>
                </div>
            </dl>

            {Object.keys(periodos).sort().reverse().map(periodo => (
                <div key={periodo} style={{ marginBottom: '30px' }}>
                    <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '5px', color: '#007bff' }}>
                        Período Letivo: {periodo}
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ background: '#eee' }}>
                                <th scope="col" style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'left' }}>Disciplina</th>
                                <th scope="col" style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>CH</th>
                                <th scope="col" style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>Média Final</th>
                                <th scope="col" style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>Faltas</th>
                                <th scope="col" style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>Situação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {periodos[periodo].map((m, idx) => (
                                <tr key={idx}>
                                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>{m.disciplina}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>{m.carga_horaria}h</td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center', fontWeight: 'bold' }}>{m.media_final ?? '-'}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center' }}>{m.faltas}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc', textAlign: 'center', fontWeight: 'bold', color: m.situacao === 'Aprovado' ? '#1b5e20' : (m.situacao === 'Em Recuperação' ? '#856404' : '#b71c1c') }}>
                                        {m.situacao || 'Cursando'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            
            {Object.keys(periodos).length === 0 && (
                <p style={{ textAlign: 'center' }}>O aluno ainda não possui registros no histórico.</p>
            )}
        </Container>
    );
}
