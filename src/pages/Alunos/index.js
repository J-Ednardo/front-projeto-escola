import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { FaUserCircle, FaEdit, FaTrashAlt, FaExclamation, FaPlus, FaSearch, FaFileAlt, FaHistory } from 'react-icons/fa';

import { Container } from '../../styles/GlobalStyles';
import { 
    PageHeader,
    AlunoContainer, 
    ProfilePicture, 
    NovoAluno, 
    FiltersContainer, 
    PaginationContainer,
    ActionGroup,
    ActionButton
} from './styled';
import axios from '../../services/axios';

import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function Alunos() {
    const perfil = useSelector(state => state.auth.user?.perfil);
    const [alunos, setAlunos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Pagination and Filter states
    const [page, setPage] = useState(1);
    const [nomeFiltro, setNomeFiltro] = useState('');
    const [situacaoFiltro, setSituacaoFiltro] = useState('');
    const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

    const getData = useCallback(async (currentPage = 1) => {
        try {
            setIsLoading(true);
            const params = {
                page: currentPage,
                limit: 10
            };

            if (nomeFiltro) params.nome = nomeFiltro;
            if (situacaoFiltro) params.situacao = situacaoFiltro;

            const response = await axios.get('/alunos', { params });
            
            setAlunos(get(response, 'data.data', []));
            setMeta(get(response, 'data.meta', { totalPages: 1, total: 0 }));
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast.error('Erro ao carregar alunos');
        }
    }, [nomeFiltro, situacaoFiltro]);

    useEffect(() => {
        getData(page);
    }, [page, getData]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        getData(1);
    };

    const handleClearFilters = () => {
        setNomeFiltro('');
        setSituacaoFiltro('');
        setPage(1);
    };

    const handleDeleteAsk = e => {
        e.preventDefault();
        const exclamation = e.currentTarget.nextSibling;
        if (exclamation) {
            exclamation.style.display = 'inline-flex';
            e.currentTarget.style.display = 'none';
        }
    };

    const handleDelete = async (e, id) => {
        e.persist();
        try {
            setIsLoading(true);
            await axios.delete(`/alunos/${id}`);
            getData(page);
            toast.success('Aluno apagado com sucesso');
        } catch(err) {
            const status = get(err, 'response.status', []);
            
            if (err.customError) {
                toast.error(err.customError.mensagem);
            } else if(status === 401) {
                toast.error('Você precisa fazer login');
            } else {
                toast.error('Ocorreu um erro ao excluir aluno');
            }
            
            setIsLoading(false);
        }
    };
    
    return (
        <Container>
            <Loading isLoading={isLoading} />

            <PageHeader>
                <div>
                    <h1>{perfil === 'PROFESSOR' ? 'Consulta de Alunos' : 'Alunos'}</h1>
                    <p className="subtitle">
                        {perfil === 'PROFESSOR'
                            ? 'Acompanhamento de boletins e histórico escolar dos discentes'
                            : 'Gestão acadêmica, cadastro e consulta de registros discentes'}
                    </p>
                </div>
                {perfil === 'ADMIN' && (
                    <NovoAluno to="/aluno/">
                        <FaPlus size={13} /> Novo aluno
                    </NovoAluno>
                )}
            </PageHeader>

            <FiltersContainer onSubmit={handleFilterSubmit}>
                <div className="search-input-wrap">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Filtrar por nome..." 
                        aria-label="Filtrar por nome do aluno"
                        value={nomeFiltro}
                        onChange={(e) => setNomeFiltro(e.target.value)}
                    />
                </div>
                <select 
                    aria-label="Filtrar por situação do aluno"
                    value={situacaoFiltro} 
                    onChange={(e) => setSituacaoFiltro(e.target.value)}
                >
                    <option value="">Todas as situações</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Reprovado por nota">Reprovado por nota</option>
                    <option value="Reprovado por falta">Reprovado por falta</option>
                    <option value="Em Recuperação">Em Recuperação</option>
                </select>
                <button type="submit">Buscar</button>
                <button type="button" className="clear-btn" onClick={handleClearFilters}>Limpar</button>
            </FiltersContainer>

            {alunos.length === 0 && !isLoading ? (
                <EmptyState 
                    title="Nenhum aluno encontrado" 
                    description="Não foram encontrados alunos correspondentes aos filtros aplicados. Tente ajustar os termos da pesquisa."
                />
            ) : (
                <AlunoContainer>
                    <table className="alunos-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>Foto</th>
                                <th>Nome</th>
                                <th>E-mail</th>
                                {perfil !== 'ALUNO' && <th style={{ textAlign: 'right' }}>Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {alunos.map((aluno, index) => (
                                <tr key={String(aluno.id)}>
                                    <td>
                                        <ProfilePicture>
                                            {get(aluno, 'Fotos[0].url', false) ? (
                                                <img src={aluno.Fotos[0].url} alt={aluno.nome} />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {(aluno.nome || 'A')[0].toUpperCase()}
                                                </div>
                                            )}
                                        </ProfilePicture>
                                    </td>
                                    <td>
                                        <span className="aluno-name">{aluno.nome} {aluno.sobrenome}</span>
                                    </td>
                                    <td>
                                        <span className="aluno-email">{aluno.email}</span>
                                    </td>
                                    {perfil !== 'ALUNO' && (
                                        <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                                            <ActionGroup>
                                                <ActionButton as={Link} to={`/boletim/${aluno.id}`} title="Ver Boletim" className="btn-secondary">
                                                    <FaFileAlt size={13} /> Boletim
                                                </ActionButton>
                                                <ActionButton as={Link} to={`/historico/${aluno.id}`} title="Ver Histórico Escolar" className="btn-secondary">
                                                    <FaHistory size={13} /> Histórico
                                                </ActionButton>
                                                {perfil === 'ADMIN' && (
                                                    <>
                                                        <ActionButton as={Link} to={`/aluno/${aluno.id}/edit`} aria-label={`Editar aluno ${aluno.nome}`} title="Editar" className="btn-icon">
                                                            <FaEdit size={14}/>
                                                        </ActionButton>
                                                        <ActionButton as={Link} onClick={handleDeleteAsk} to={`/aluno/${aluno.id}/delete`} aria-label={`Solicitar exclusão do aluno ${aluno.nome}`} title="Excluir" className="btn-icon btn-danger-soft">
                                                            <FaTrashAlt size={14} />
                                                        </ActionButton>

                                                        <button 
                                                            className="delete-btn-invisible"
                                                            aria-label={`Confirmar exclusão do aluno ${aluno.nome}`}
                                                            style={{ display: 'none' }}
                                                            onClick={e => handleDelete(e, aluno.id, index)}
                                                            title="Clique para confirmar exclusão"
                                                        >
                                                            <FaExclamation size={14} /> Confirmar
                                                        </button>
                                                    </>
                                                )}
                                            </ActionGroup>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </AlunoContainer>
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
