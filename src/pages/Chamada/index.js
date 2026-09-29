import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import axios from '../../services/axios';

export default function Chamada() {
    const { id } = useParams(); // turma_id
    const history = useHistory();
    const [matriculas, setMatriculas] = useState([]);
    const [dataAula, setDataAula] = useState(new Date().toISOString().split('T')[0]);
    const [conteudo, setConteudo] = useState('');
    const [presencas, setPresencas] = useState({}); // { matricula_id: true/false }
    const [turma, setTurma] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                const [resMat, resTurma] = await Promise.all([
                    axios.get('/matriculas'),
                    axios.get(`/turmas/${id}`)
                ]);
                const turmMat = resMat.data.filter(m => String(m.turma_id) === String(id));
                setMatriculas(turmMat);
                
                const pres = {};
                turmMat.forEach(m => pres[m.id] = true);
                setPresencas(pres);
                setTurma(resTurma.data);

                setIsLoading(false);
            } catch(e) {
                setIsLoading(false);
                toast.error('Erro ao carregar dados para chamada');
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
            <h1>Fazer Chamada - Turma {id}</h1>

            {isFechado && (
                <div style={{ background: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '4px', marginTop: '15px', fontWeight: 'bold' }}>
                    Este semestre esta encerrado e arquivado. Edicoes bloqueadas.
                </div>
            )}

            <form onSubmit={handleSalvarChamada} style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Data da Aula</label>
                        <input type="date" value={dataAula} onChange={e => setDataAula(e.target.value)} disabled={isFechado} required style={{ width: '100%', padding: '8px', background: isFechado ? '#e9ecef' : '#fff' }} />
                    </div>
                    <div style={{ flex: 3 }}>
                        <label>Conteúdo Ministrado</label>
                        <input type="text" value={conteudo} onChange={e => setConteudo(e.target.value)} disabled={isFechado} required style={{ width: '100%', padding: '8px', background: isFechado ? '#e9ecef' : '#fff' }} />
                    </div>
                </div>

                <table style={{ marginBottom: '20px' }}>
                    <thead>
                        <tr>
                            <th>Aluno (Matrícula ID)</th>
                            <th style={{ textAlign: 'center', width: '150px' }}>Presença</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matriculas.map(m => (
                            <tr key={m.id} style={{ backgroundColor: presencas[m.id] ? 'inherit' : '#ffe6e6' }}>
                                <td>
                                    {m.Aluno?.nome} {m.Aluno?.sobrenome} (Matrícula #{m.id})
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button 
                                        type="button"
                                        disabled={isFechado}
                                        onClick={() => handleToggle(m.id)}
                                        style={{ 
                                            background: presencas[m.id] ? '#00b894' : '#d63031', 
                                            height: '40px',
                                            padding: '0 16px',
                                            width: '100%',
                                            opacity: isFechado ? 0.6 : 1
                                        }}
                                    >
                                        {presencas[m.id] ? 'Presente' : 'Falta'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {matriculas.length > 0 ? (
                    <button type="submit" disabled={isFechado} style={{ width: '100%', padding: '15px', background: '#007bff', color: '#fff', fontSize: '16px', cursor: isFechado ? 'not-allowed' : 'pointer', opacity: isFechado ? 0.6 : 1 }}>
                        Salvar Lote de Chamada
                    </button>
                ) : (
                    <p>Nenhum aluno matriculado nesta turma.</p>
                )}
            </form>
        </Container>
    );
}
