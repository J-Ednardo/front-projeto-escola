import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import axios from '../../services/axios';
import { 
    PageHeader, 
    TableWrapper, 
    RoleBadge, 
    ActionButton, 
    PaginationContainer 
} from './styled';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    // Form states
    const [perfil, setPerfil] = useState('');
    const [alunoId, setAlunoId] = useState('');

    // Pagination
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ totalPages: 1 });

    useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);
                const { data } = await axios.get('/users', { params: { page, limit: 10 } });
                setUsuarios(data.data || []);
                setMeta(data.meta || { totalPages: 1 });
                setIsLoading(false);
            } catch(e) {
                setIsLoading(false);
                toast.error('Erro ao carregar usuários');
            }
        }
        getData();
    }, [page]);

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
            if (!alunoId || perfil !== 'ALUNO') body.aluno_id = null;

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

    const getRoleClass = (p) => {
        if (p === 'ADMIN') return 'admin';
        if (p === 'PROFESSOR') return 'professor';
        if (p === 'ALUNO') return 'aluno';
        return 'user';
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />
            
            <PageHeader>
                <div>
                    <h1>Gerenciamento de Usuários</h1>
                    <p className="subtitle">Administração de perfis de acesso, permissões e vinculação com alunos</p>
                </div>
            </PageHeader>

            {usuarios.length === 0 && !isLoading ? (
                <EmptyState 
                    title="Nenhum usuário cadastrado" 
                    description="Não existem registros de contas de usuários no sistema."
                />
            ) : (
                <TableWrapper>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th style={{ width: '150px' }}>Perfil</th>
                                <th style={{ width: '130px' }}>Aluno ID</th>
                                <th style={{ width: '160px', textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(u => (
                                <tr key={u.id}>
                                    <td style={{ color: '#94A3B8', fontWeight: 600 }}>#{u.id}</td>
                                    <td style={{ fontWeight: 600 }}>{u.nome}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        {editingUserId === u.id ? (
                                            <select 
                                                value={perfil} 
                                                onChange={e => setPerfil(e.target.value)}
                                                style={{ height: '36px', padding: '0 8px', fontSize: '13px' }}
                                            >
                                                <option value="ALUNO">ALUNO</option>
                                                <option value="PROFESSOR">PROFESSOR</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        ) : (
                                            <RoleBadge className={getRoleClass(u.perfil)}>
                                                {u.perfil}
                                            </RoleBadge>
                                        )}
                                    </td>
                                    <td>
                                        {editingUserId === u.id && perfil === 'ALUNO' ? (
                                            <input 
                                                type="number" 
                                                value={alunoId} 
                                                onChange={e => setAlunoId(e.target.value)} 
                                                placeholder="ID do Aluno"
                                                style={{ width: '110px', height: '36px', padding: '0 8px', fontSize: '13px' }}
                                            />
                                        ) : (
                                            u.aluno_id ? (
                                                <span style={{ fontWeight: 600, color: '#2563EB' }}>
                                                    Aluno #{u.aluno_id}
                                                </span>
                                            ) : '-'
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {editingUserId === u.id ? (
                                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                <ActionButton onClick={(e) => handleSave(e, u.id)} className="save">
                                                    Salvar
                                                </ActionButton>
                                                <ActionButton onClick={handleCancelEdit} className="cancel">
                                                    Cancelar
                                                </ActionButton>
                                            </div>
                                        ) : (
                                            <ActionButton onClick={() => handleEditClick(u)} className="edit">
                                                Editar
                                            </ActionButton>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableWrapper>
            )}

            {meta.totalPages > 1 && (
                <PaginationContainer>
                    <button 
                        onClick={() => setPage(page - 1)} 
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    <span>Página {page} de {meta.totalPages}</span>
                    <button 
                        onClick={() => setPage(page + 1)} 
                        disabled={page === meta.totalPages}
                    >
                        Próximo
                    </button>
                </PaginationContainer>
            )}
        </Container>
    );
}
