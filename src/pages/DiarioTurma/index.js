import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import { get } from 'lodash';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import axios from '../../services/axios';

export default function DiarioTurma() {
    const { id } = useParams(); // turma_id
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
        try {
            setIsLoading(true);
            const { data } = await axios.post('/matriculas', { 
                turma_id: id,
                aluno_id: alunoId 
            });
            setMatriculas([...matriculas, data]);
            toast.success('Aluno matriculado!');
            setIsLoading(false);
        } catch(e) {
            setIsLoading(false);
            toast.error('Erro ao matricular aluno');
        }
    };

    const handleSalvarNota = async (matriculaId, field, value) => {
        try {
            const payload = {};
            payload[field] = value;
            const { data } = await axios.put(`/matriculas/${matriculaId}`, payload);
            
            setMatriculas(matriculas.map(m => m.id === matriculaId ? { ...m, ...data } : m));
            toast.success('Nota salva com sucesso');
        } catch(e) {
            toast.error('Erro ao salvar nota');
        }
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Diário da Turma {id}</h1>
                <Link to={`/turmas/${id}/chamada`} style={{ padding: '10px 15px', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
                    Fazer Chamada
                </Link>
            </div>

            {isFechado && (
                <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '4px', marginTop: '15px', fontWeight: 'bold' }}>
                    Este semestre esta encerrado e arquivado. Edicoes bloqueadas.
                </div>
            )}

            <form onSubmit={handleMatricular} style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
                <select value={alunoId} onChange={e => setAlunoId(e.target.value)} required disabled={isFechado} style={{ background: isFechado ? '#e9ecef' : '#fff' }}>
                    <option value="">Selecione o Aluno</option>
                    {alunos.map(a => <option key={a.id} value={a.id}>{a.nome} {a.sobrenome}</option>)}
                </select>
                <button type="submit" disabled={isFechado} style={{ opacity: isFechado ? 0.6 : 1, cursor: isFechado ? 'not-allowed' : 'pointer' }}>Matricular</button>
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>Matrícula ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>Faltas</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>N1</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>N2</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>N3</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>Recuperação</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>Média</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>Situação</th>
                    </tr>
                </thead>
                <tbody>
                    {matriculas.map(m => {
                        const faltasCalc = (m.faltas_legado || 0) + (m.Frequencias ? m.Frequencias.filter(f => !f.presente).length : 0);
                        const reprovado = m.situacao === 'Reprovado por falta' || m.situacao === 'Reprovado por nota';
                        const recuperacao = m.situacao === 'Em Recuperação';
                        
                        let bgColor = 'inherit';
                        if (reprovado) bgColor = '#ffe6e6'; // Vermelho claro
                        if (recuperacao) bgColor = '#fff3cd'; // Amarelo/Laranja claro
                        
                        let textColor = 'inherit';
                        if (reprovado) textColor = 'red';
                        if (recuperacao) textColor = '#856404';

                        return (
                        <tr key={m.id} style={{ backgroundColor: bgColor }}>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>#{m.id} (Aluno {m.aluno_id})</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc', color: reprovado ? 'red' : 'inherit', fontWeight: 'bold' }}>
                                {faltasCalc}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                <input type="number" defaultValue={m.nota1} disabled={isFechado} onBlur={e => handleSalvarNota(m.id, 'nota1', e.target.value)} style={{ width: '60px', background: isFechado ? '#e9ecef' : '#fff' }} />
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                <input type="number" defaultValue={m.nota2} disabled={isFechado} onBlur={e => handleSalvarNota(m.id, 'nota2', e.target.value)} style={{ width: '60px', background: isFechado ? '#e9ecef' : '#fff' }} />
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                <input type="number" defaultValue={m.nota3} disabled={isFechado} onBlur={e => handleSalvarNota(m.id, 'nota3', e.target.value)} style={{ width: '60px', background: isFechado ? '#e9ecef' : '#fff' }} />
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                <input 
                                    type="number" 
                                    defaultValue={m.nota_recuperacao} 
                                    onBlur={e => handleSalvarNota(m.id, 'nota_recuperacao', e.target.value)} 
                                    style={{ width: '60px', background: (isFechado || (!recuperacao && m.nota_recuperacao === null)) ? '#e9ecef' : '#fff' }} 
                                    disabled={isFechado || (!recuperacao && m.nota_recuperacao === null)} 
                                    title={isFechado ? "Semestre encerrado" : (!recuperacao && m.nota_recuperacao === null ? "Aluno não está em recuperação" : "")}
                                />
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{m.media_final}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc', color: textColor, fontWeight: (reprovado || recuperacao) ? 'bold' : 'normal' }}>
                                {m.situacao}
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </Container>
    );
}
