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
        margin-top: 8px;
    }
`;
