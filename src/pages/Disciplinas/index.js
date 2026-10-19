import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaClock, FaEdit, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import axios from '../../services/axios';
import { PageHeader, FormCard, DisciplinasTableWrapper } from './styled';

export default function Disciplinas() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [nome, setNome] = useState('');
    const [carga, setCarga] = useState('');
    const [editingId, setEditingId] = useState(null);
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
            if (editingId) {
                const { data } = await axios.put(`/disciplinas/${editingId}`, { nome, carga_horaria: carga });
                setDisciplinas(disciplinas.map(d => d.id === editingId ? data : d));
                toast.success('Disciplina atualizada!');
            } else {
                const { data } = await axios.post('/disciplinas', { nome, carga_horaria: carga });
                setDisciplinas([...disciplinas, data]);
                toast.success('Disciplina cadastrada!');
            }
            setNome('');
            setCarga('');
            setEditingId(null);
            setIsLoading(false);
        } catch(e) {
            setIsLoading(false);
            toast.error(editingId ? 'Erro ao atualizar disciplina' : 'Erro ao cadastrar disciplina');
        }
    };

    const handleEdit = (disc) => {
        setEditingId(disc.id);
        setNome(disc.nome);
        setCarga(disc.carga_horaria);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNome('');
        setCarga('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Deseja realmente excluir esta disciplina?')) return;
        try {
            setIsLoading(true);
            await axios.delete(`/disciplinas/${id}`);
            setDisciplinas(disciplinas.filter(d => d.id !== id));
            toast.success('Disciplina removida!');
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            toast.error('Erro ao excluir disciplina');
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
                <h3>{editingId ? `Editando Disciplina #${editingId}` : 'Cadastrar Nova Disciplina'}</h3>
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit">
                            {editingId ? <><FaCheck size={12} /> Salvar</> : <><FaPlus size={12} /> Cadastrar</>}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                style={{ background: '#64748B' }}
                            >
                                <FaTimes size={12} /> Cancelar
                            </button>
                        )}
                    </div>
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
                                <th style={{ width: '120px', textAlign: 'right' }}>Ações</th>
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
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(d)}
                                                title="Editar disciplina"
                                                style={{ padding: '6px 10px', background: '#F1F5F9', color: '#0F172A' }}
                                            >
                                                <FaEdit size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(d.id)}
                                                title="Excluir disciplina"
                                                style={{ padding: '6px 10px', background: '#FEF2F2', color: '#DC2626' }}
                                            >
                                                <FaTrashAlt size={13} />
                                            </button>
                                        </div>
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

