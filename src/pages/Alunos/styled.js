import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors, metrics } from '../../styles/theme';

export const AlunoContainer = styled.div`
    margin-top: 20px;

    div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 0;
    }

    div + div {
        border-top: 1px solid ${colors.border};
    }
`;

export const ProfilePicture = styled.div`
    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }
`;

export const NovoAluno = styled(Link)`
    display: inline-block;
    background: ${colors.success};
    color: #fff;
    padding: 10px 20px;
    border-radius: ${metrics.borderRadius};
    font-weight: 600;
    margin: 20px 0;
    transition: all 0.3s;

    &:hover {
        filter: brightness(90%);
        color: #fff;
    }
`;

export const FiltersContainer = styled.form`
    display: flex;
    gap: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    align-items: center;

    input, select {
        padding: 12px;
        border: 1px solid ${colors.border};
        border-radius: 8px;
        font-family: inherit;
        background: #fdfdfd;
        flex: 1;
    }

    button {
        padding: 12px 24px;
        border-radius: 8px;
    }

    button.clear-btn {
        background: #E8E9ED;
        color: ${colors.textTitle};
    }
`;

export const PaginationContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;

    button {
        padding: 8px 16px;
        border-radius: 8px;
    }

    button:disabled {
        background: ${colors.border};
        color: ${colors.textBody};
        cursor: not-allowed;
    }

    span {
        font-weight: 600;
        color: ${colors.textBody};
    }
`;