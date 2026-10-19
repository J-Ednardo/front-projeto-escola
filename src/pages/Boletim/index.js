import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useSelector } from 'react-redux';
import { FaFilePdf, FaGraduationCap } from 'react-icons/fa';

import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import { 
    PageHeader, 
    DownloadPdfButton, 
    StudentBanner, 
    BoletimTable, 
    StatusPill 
} from './styled';

export default function Boletim() {
    const { id } = useParams();
    const [aluno, setAluno] = useState({});
    const [matriculas, setMatriculas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const userAlunoId = useSelector(state => state.auth.user?.aluno_id);
    const fetchId = (id && id !== 'null' && id !== 'undefined') ? id : userAlunoId;

    useEffect(() => {
        if (!fetchId) return;

        async function getData() {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/alunos/${fetchId}`);
                setAluno(data);
                setMatriculas(get(data, 'Matriculas', []));
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                toast.error('Erro ao carregar boletim');
            }
        }
        getData();
    }, [fetchId]);

    if (!fetchId) {
        return (
            <Container>
                <h2>Acesso Restrito</h2>
                <p style={{ marginTop: '12px', color: '#64748B' }}>
                    Sua conta de usuário ainda não está vinculada a nenhum registro de aluno. Por favor, contate a secretaria ou o administrador do sistema para realizar a vinculação.
                </p>
            </Container>
        );
    }

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text(`Boletim Escolar - ${aluno.nome} ${aluno.sobrenome}`, 14, 22);
        
        const tableColumn = ["Disciplina", "Turma", "Faltas", "N1", "N2", "N3", "Rec", "Média", "Situação"];
        const tableRows = [];

        matriculas.forEach(m => {
            const faltasArray = m.Frequencia || m.Frequencias || [];
            const novasFaltas = faltasArray.filter(f => f.presente === false || f.presente === 0 || f.presente === '0').length;
            const faltasCalc = (m.faltas_legado || 0) + novasFaltas;
            const data = [
                m.Turma?.Disciplina?.nome || 'N/A',
                m.Turma?.codigo || 'N/A',
                faltasCalc,
                m.nota1 ?? '-',
                m.nota2 ?? '-',
                m.nota3 ?? '-',
                m.nota_recuperacao ?? '-',
                m.media_final ?? '-',
                m.situacao || '-'
            ];
            tableRows.push(data);
        });

        autoTable(doc, {
            startY: 30,
            head: [tableColumn],
            body: tableRows,
        });

        doc.save(`Boletim_${aluno.nome}.pdf`);
    };

    const getStatusClass = (situacao) => {
        if (!situacao) return 'cursando';
        if (situacao === 'Aprovado') return 'aprovado';
        if (situacao === 'Em Recuperação') return 'recuperacao';
        if (situacao.includes('Reprovado')) return 'reprovado';
        return 'cursando';
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />
            
            <PageHeader>
                <div>
                    <h1>Boletim: {aluno.nome} {aluno.sobrenome}</h1>
                    <p className="subtitle">Desempenho acadêmico consolidado e notas parciais</p>
                </div>
                <DownloadPdfButton onClick={handleDownloadPDF}>
                    <FaFilePdf size={14} color="#DC2626" /> Baixar PDF
                </DownloadPdfButton>
            </PageHeader>

            <StudentBanner>
                <div className="student-avatar">
                    {get(aluno, 'Fotos[0].url', false) ? (
                        <img src={aluno.Fotos[0].url} alt={aluno.nome} />
                    ) : (
                        <div className="avatar-placeholder">
                            {(aluno.nome || 'A')[0].toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="student-details">
                    <h3>{aluno.nome} {aluno.sobrenome}</h3>
                    <p>{aluno.email} • Matrículas ativas: {matriculas.length}</p>
                </div>
            </StudentBanner>

            <div style={{ overflowX: 'auto' }}>
                <BoletimTable>
                    <thead>
                        <tr>
                            <th>Disciplina</th>
                            <th>Turma</th>
                            <th>Faltas</th>
                            <th>N1</th>
                            <th>N2</th>
                            <th>N3</th>
                            <th>Rec.</th>
                            <th>Média</th>
                            <th>Situação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matriculas.map(m => {
                            const faltasArray = m.Frequencia || m.Frequencias || [];
                            const novasFaltas = faltasArray.filter(f => f.presente === false || f.presente === 0 || f.presente === '0').length;
                            const faltasCalc = (m.faltas_legado || 0) + novasFaltas;
                            const reprovado = m.situacao === 'Reprovado por falta' || m.situacao === 'Reprovado por nota';

                            return (
                                <tr key={m.id}>
                                    <td style={{ fontWeight: 600 }}>{m.Turma?.Disciplina?.nome || 'N/A'}</td>
                                    <td>Turma {m.Turma?.codigo || 'N/A'}</td>
                                    <td style={{ fontWeight: 700, color: reprovado ? '#DC2626' : 'inherit' }}>{faltasCalc}</td>
                                    <td>{m.nota1 ?? '-'}</td>
                                    <td>{m.nota2 ?? '-'}</td>
                                    <td>{m.nota3 ?? '-'}</td>
                                    <td>{m.nota_recuperacao ?? '-'}</td>
                                    <td style={{ fontWeight: 700 }}>{m.media_final ?? '-'}</td>
                                    <td>
                                        <StatusPill className={getStatusClass(m.situacao)}>
                                            {m.situacao || '-'}
                                        </StatusPill>
                                    </td>
                                </tr>
                            );
                        })}
                        {matriculas.length === 0 && (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: '32px' }}>
                                    Nenhuma matrícula encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </BoletimTable>
            </div>
        </Container>
    );
}
