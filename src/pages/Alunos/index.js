import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { FaUserCircle, FaEdit, FaWindowClose, FaExclamation } from 'react-icons/fa';

import { Container } from '../../styles/GlobalStyles';
import { AlunoContainer, ProfilePicture, NovoAluno, FiltersContainer, PaginationContainer } from './styled';
import axios from '../../services/axios';

import Loading from '../../components/Loading';
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
            
            // Adjust to new API response format { data, meta }
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
        setPage(1); // Back to first page when filtering
        getData(1);
    };

    const handleClearFilters = () => {
        setNomeFiltro('');
        setSituacaoFiltro('');
        setPage(1);
        // getData will be called because page might change, 
        // but to be sure we can just rely on the effect, or call it directly:
        // Actually, since we use useCallback and useEffect, changing state triggers re-render, 
        // but if page is already 1, effect won't re-run for filter clear unless we put filters in dependency array.
        // It's safer to just let the effect handle it by putting getData in dependency array.
    };

    const handleDeleteAsk = e => {
        e.preventDefault();

        const exclamation = e.currentTarget.nextSibling;
        exclamation.setAttribute('display', 'block');
        e.currentTarget.remove();
    };

    const handleDelete = async (e, id, index) => {
        e.persist();
        try {
            setIsLoading(true);
            await axios.delete(`/alunos/${id}`)
            
            // Re-fetch current page to handle pagination correctly after delete
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
    }
    
    return (
        <Container>
            <Loading isLoading={isLoading} />

            <h1>Alunos</h1>

            <FiltersContainer onSubmit={handleFilterSubmit}>
                <input 
                    type="text" 
                    placeholder="Filtrar por nome..." 
                    value={nomeFiltro}
                    onChange={(e) => setNomeFiltro(e.target.value)}
                />
                <select 
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

            {perfil !== 'ALUNO' && (
                <NovoAluno to="/aluno/">Novo aluno</NovoAluno>
            )}

            <AlunoContainer>
                {alunos.length === 0 && !isLoading && (
                    <p style={{ marginTop: '20px' }}>Nenhum aluno encontrado.</p>
                )}
                {alunos.map((aluno, index) => (
                    <div key={String(aluno.id)}>
                        <ProfilePicture>
                            {get(aluno, 'Fotos[0].url', false) ? (
                                <img src={aluno.Fotos[0].url} alt={aluno.nome}></img>
                            ) : (
                                <FaUserCircle size={36}/>
                            )}
                        </ProfilePicture>

                        <span>{aluno.nome}</span>
                        <span>{aluno.email}</span>

                        {perfil !== 'ALUNO' && (
                            <>
                                <Link to={`/boletim/${aluno.id}`} title="Ver Boletim" style={{ marginLeft: '10px' }}>
                                    Boletim
                                </Link>
                                <Link to={`/historico/${aluno.id}`} title="Ver Histórico Escolar" style={{ marginLeft: '10px', color: '#17a2b8' }}>
                                    Histórico
                                </Link>
                                <Link to={`/aluno/${aluno.id}/edit`} style={{ marginLeft: '10px' }}>
                                    <FaEdit size={16}/>
                                </Link>
                                <Link onClick={handleDeleteAsk} to={`/aluno/${aluno.id}/delete`}>
                                    <FaWindowClose size={16} />
                                </Link>

                                <FaExclamation 
                                    size={16} 
                                    display="none" 
                                    cursor="pointer"
                                    onClick={
                                        e => handleDelete(e, aluno.id, index)
                                    }
                                />
                            </>
                        )}
                    </div>
                ))}
            </AlunoContainer>

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
