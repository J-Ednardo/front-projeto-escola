import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import { Form } from './styled';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    // Form states
    const [perfil, setPerfil] = useState('');
    const [alunoId, setAlunoId] = useState('');

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                const { data } = await axios.get('/users');
                setUsuarios(data);
                setIsLoading(false);
            } catch(e) {
                setIsLoading(false);
                toast.error('Erro ao carregar usuários');
            }
        }
        getData();
    }, []);

    const handleEditClick = (user) => {
        setEditingUserId(user.id);
        setPerfil(user.perfil || '');
        setAlunoId(user.aluno_id || '');
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
        setPerfil('');
        setAlunoId('');
    };

    const handleSave = async (e, id) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const body = { perfil };
            if (alunoId && perfil === 'ALUNO') body.aluno_id = Number(alunoId);
            if (!alunoId || perfil !== 'ALUNO') body.aluno_id = null; // Backend might need handling to set null

            const { data } = await axios.put(`/users/${id}`, body);
            
            setUsuarios(usuarios.map(u => u.id === id ? data : u));
            toast.success('Usuário atualizado com sucesso!');
            handleCancelEdit();
            setIsLoading(false);
        } catch(e) {
            setIsLoading(false);
            const msg = e.customError ? e.customError.mensagem : 'Erro ao atualizar usuário';
            toast.error(msg);
        }
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />
            <h1>Gerenciamento de Usuários</h1>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Perfil</th>
                        <th>Aluno ID</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.nome}</td>
                            <td>{u.email}</td>
                            <td>
                                {editingUserId === u.id ? (
                                    <select value={perfil} onChange={e => setPerfil(e.target.value)}>
                                        <option value="ALUNO">ALUNO</option>
                                        <option value="PROFESSOR">PROFESSOR</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                ) : (
                                    <span style={{ 
                                        background: u.perfil === 'ADMIN' ? '#ff7675' : (u.perfil === 'PROFESSOR' ? '#74b9ff' : '#55efc4'),
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' 
                                    }}>
                                        {u.perfil}
                                    </span>
                                )}
                            </td>
                            <td>
                                {editingUserId === u.id && perfil === 'ALUNO' ? (
                                    <input 
                                        type="number" 
                                        value={alunoId} 
                                        onChange={e => setAlunoId(e.target.value)} 
                                        placeholder="ID do Aluno"
                                        style={{ width: '80px', padding: '4px' }}
                                    />
                                ) : (
                                    u.aluno_id || '-'
                                )}
                            </td>
                            <td>
                                {editingUserId === u.id ? (
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button onClick={(e) => handleSave(e, u.id)} style={{ background: '#00b894', padding: '6px 12px' }}>Salvar</button>
                                        <button onClick={handleCancelEdit} style={{ background: '#d63031', padding: '6px 12px' }}>Cancelar</button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleEditClick(u)} style={{ background: '#0984e3', padding: '6px 12px' }}>Editar</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    );
}
