import styled from 'styled-components';
import { colors } from '../../styles/theme';

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
`;

export const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 20px;

    button {
        background: ${colors.primary};
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s;
        height: auto;

        &:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        &:hover:not(:disabled) {
            filter: brightness(0.9);
        }
    }

    span {
        font-weight: 600;
        color: ${colors.textTitle};
    }
`;
