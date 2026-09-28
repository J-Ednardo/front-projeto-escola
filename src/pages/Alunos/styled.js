import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const AlunoContainer = styled.div`
    margin-top: 20px;

    div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 0;
    }

    div + div{
        border-top: 1px solid #eee;
    }
`;

export const ProfilePicture = styled.div`
    img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
    }
`;

export const NovoAluno = styled(Link)`
    display: block;
    padding: 20px 0 10px 0;
`;

export const FiltersContainer = styled.form`
    display: flex;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    align-items: center;

    input, select {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 8px 16px;
    }

    button.clear-btn {
        background: #ccc;
        color: #333;
    }
`;

export const PaginationContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;

    button {
        padding: 8px 16px;
    }

    button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    span {
        font-weight: bold;
    }
`;