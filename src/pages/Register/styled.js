import styled from 'styled-components';
import { colors } from '../../styles/theme';

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    label {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        font-weight: 500;
        font-size: 14px;
        color: ${colors.textBody};
    }

    input {
        height: 48px;
        font-size: 16px;
        font-family: inherit;
        border: 1px solid ${colors.border};
        padding: 0 16px;
        border-radius: 12px;
        margin-top: 8px;
        background: #FAFAFA;
        transition: all 0.3s;

        &:focus {
            border: 1px solid ${colors.primary};
            box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
        }
    }
`;
