import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaBook, FaPlus, FaClock } from 'react-icons/fa';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import axios from '../../services/axios';
import { PageHeader, FormCard, DisciplinasTableWrapper } from './styled';

export default function Disciplinas() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [nome, setNome] = useState('');
    const [carga, setCarga] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                const { data } = await axios.get('/disciplinas');
                setDisciplinas(data);
                setIsLoading(false);
            } catch(e) {
                setIsLoading(false);
                toast.error('Erro ao carregar disciplinas');
            }
        }
        getData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const { data } = await axios.post('/disciplinas', { nome, carga_horaria: carga });
            setDisciplinas([...disciplinas, data]);
            setNome('');
            setCarga('');
            toast.success('Disciplina cadastrada!');
            setIsLoading(false);
        } catch(e) {
            setIsLoading(false);
            toast.error('Erro ao cadastrar disciplina');
        }
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />
            
            <PageHeader>
                <div>
                    <h1>Disciplinas</h1>
                    <p className="subtitle">Catálogo curricular e carga horária das matérias ofertadas</p>
                </div>
            </PageHeader>

            <FormCard>
                <h3>Cadastrar Nova Disciplina</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Nome" 
                        value={nome} 
                        onChange={e => setNome(e.target.value)} 
                        required 
                    />
                    <input 
                        type="number" 
                        placeholder="Carga horária" 
                        value={carga} 
                        onChange={e => setCarga(e.target.value)} 
                        required 
                    />
                    <button type="submit">
                        <FaPlus size={12} /> Cadastrar
                    </button>
                </form>
            </FormCard>

            {disciplinas.length === 0 && !isLoading ? (
                <EmptyState 
                    title="Nenhuma disciplina cadastrada" 
                    description="Cadastre as disciplinas da matriz curricular utilizando o formulário acima."
                />
            ) : (
                <DisciplinasTableWrapper>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Nome da Disciplina</th>
                                <th style={{ width: '160px', textAlign: 'center' }}>Carga Horária</th>
                            </tr>
                        </thead>
                        <tbody>
                            {disciplinas.map(d => (
                                <tr key={d.id}>
                                    <td style={{ color: '#94A3B8', fontWeight: 600 }}>#{d.id}</td>
                                    <td style={{ fontWeight: 600 }}>{d.nome}</td>
                                    <td style={{ textAlign: 'center', fontWeight: 700 }}>
                                        <span style={{ 
                                            background: '#EFF6FF', 
                                            color: '#2563EB', 
                                            padding: '4px 10px', 
                                            borderRadius: '6px', 
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <FaClock size={11} /> {d.carga_horaria}h
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DisciplinasTableWrapper>
            )}
        </Container>
    );
}
