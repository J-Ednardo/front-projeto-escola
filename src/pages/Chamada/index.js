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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                // Carrega alunos matriculados na turma
                const resMat = await axios.get('/matriculas');
                const turmMat = resMat.data.filter(m => String(m.turma_id) === String(id));
                setMatriculas(turmMat);
                
                // Inicializa todo mundo como presente
                const pres = {};
                turmMat.forEach(m => pres[m.id] = true);
                setPresencas(pres);

                setIsLoading(false);
            } catch(e) {
                setIsLoading(false);
                toast.error('Erro ao carregar matrículas para chamada');
            }
        }
        getData();
    }, [id]);

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

            <form onSubmit={handleSalvarChamada} style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Data da Aula</label>
                        <input type="date" value={dataAula} onChange={e => setDataAula(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div style={{ flex: 3 }}>
                        <label>Conteúdo Ministrado</label>
                        <input type="text" value={conteudo} onChange={e => setConteudo(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left' }}>Aluno (Matrícula ID)</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center', width: '150px' }}>Presença</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matriculas.map(m => (
                            <tr key={m.id} style={{ backgroundColor: presencas[m.id] ? 'inherit' : '#ffe6e6' }}>
                                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                                    {m.Aluno?.nome} {m.Aluno?.sobrenome} (Matrícula #{m.id})
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                                    <button 
                                        type="button"
                                        onClick={() => handleToggle(m.id)}
                                        style={{ 
                                            background: presencas[m.id] ? '#28a745' : '#dc3545', 
                                            color: '#fff', 
                                            padding: '8px 15px', 
                                            border: 'none', 
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            width: '100%'
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
                    <button type="submit" style={{ width: '100%', padding: '15px', background: '#007bff', color: '#fff', fontSize: '16px' }}>
                        Salvar Lote de Chamada
                    </button>
                ) : (
                    <p>Nenhum aluno matriculado nesta turma.</p>
                )}
            </form>
        </Container>
    );
}
