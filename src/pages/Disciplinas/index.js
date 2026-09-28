import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import axios from '../../services/axios';

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
            <h1>Disciplinas</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
                <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
                <input type="number" placeholder="Carga horária" value={carga} onChange={e => setCarga(e.target.value)} required />
                <button type="submit">Cadastrar</button>
            </form>

            <ul>
                {disciplinas.map(d => (
                    <li key={d.id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                        {d.nome} - {d.carga_horaria}h
                    </li>
                ))}
            </ul>
        </Container>
    );
}
