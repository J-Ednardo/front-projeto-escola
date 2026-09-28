import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import axios from '../../services/axios';
import { BoletimTable } from './styled';

export default function Boletim() {
    const { id } = useParams();
    const [aluno, setAluno] = useState({});
    const [matriculas, setMatriculas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const userAlunoId = useSelector(state => state.auth.user?.aluno_id);
    const fetchId = id || userAlunoId;

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

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text(`Boletim Escolar - ${aluno.nome} ${aluno.sobrenome}`, 14, 22);
        
        const tableColumn = ["Disciplina", "Turma", "Faltas", "N1", "N2", "N3", "Rec", "Média", "Situação"];
        const tableRows = [];

        matriculas.forEach(m => {
            const faltasCalc = (m.faltas_legado || 0) + (m.Frequencias ? m.Frequencias.filter(f => !f.presente).length : 0);
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

        doc.autoTable({
            startY: 30,
            head: [tableColumn],
            body: tableRows,
        });

        doc.save(`Boletim_${aluno.nome}.pdf`);
    };

    return (
        <Container>
            <Loading isLoading={isLoading} />
            <h1>Boletim: {aluno.nome} {aluno.sobrenome}</h1>
            
            <button onClick={handleDownloadPDF} style={{ marginBottom: '20px', padding: '10px' }}>
                Baixar PDF
            </button>

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
                                <td>{m.Turma?.Disciplina?.nome || 'N/A'}</td>
                                <td>{m.Turma?.codigo || 'N/A'}</td>
                                <td>{faltasCalc}</td>
                                <td>{m.nota1 ?? '-'}</td>
                                <td>{m.nota2 ?? '-'}</td>
                                <td>{m.nota3 ?? '-'}</td>
                                <td>{m.nota_recuperacao ?? '-'}</td>
                                <td>{m.media_final ?? '-'}</td>
                                <td style={{ fontWeight: (reprovado || recuperacao) ? 'bold' : 'normal', color: textColor }}>
                                    {m.situacao || '-'}
                                </td>
                            </tr>
                        );
                    })}
                    {matriculas.length === 0 && (
                        <tr>
                            <td colSpan="9" style={{textAlign: 'center'}}>Nenhuma matrícula encontrada.</td>
                        </tr>
                    )}
                </tbody>
            </BoletimTable>
        </Container>
    );
}
