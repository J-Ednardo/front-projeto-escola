import styled from 'styled-components';
import { colors } from '../../styles/theme';

export const BoletimTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
        border: 1px solid ${colors.border};
        padding: 14px 16px;
        text-align: left;
        font-size: 14px;
    }

    th {
        background: ${colors.background};
        font-weight: 600;
        color: ${colors.textTitle};
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.5px;
    }

    tr:nth-child(even) {
        background: #FAFBFC;
    }

    tr:hover {
        background: #F0F1F5;
    }
`;
